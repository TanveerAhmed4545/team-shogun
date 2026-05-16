import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Activity from "@/models/Activity";
import { pusherServer } from "@/lib/pusher";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import { z } from "zod";

const updateSchema = z.object({
  clientName: z.string().min(2).max(100).optional(),
  profileName: z.string().min(2).max(100).optional(),
  orderId: z.string().min(3).max(50).optional(),
  value: z.number().min(0).optional(),
  orderStatus: z.enum(["Pending", "WIP", "Revision", "Delivered", "Completed", "Cancelled"]).optional(),
  deadline: z.string().refine(val => !isNaN(Date.parse(val))).optional(),
  developer: z.object({
    id: z.string().optional(),
    name: z.string().optional()
  }).optional(),
}).passthrough();

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const project = await Project.findById(id).populate("developer.id", "name avatar");

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    
    // First, fetch the project to check ownership
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const isAdmin = session.user.role === "admin";
    const isDeveloper = existingProject.developer?.id?.toString() === session.user.id || 
                       (existingProject.developer?.name && existingProject.developer.name === session.user.name);
    const isCreator = existingProject.createdBy?.toString() === session.user.id;

    if (!isAdmin && !isDeveloper && !isCreator) {
      return NextResponse.json({ message: "Forbidden: You do not have permission to edit this project." }, { status: 403 });
    }

    // Rate limiting (max 20 updates per minute per user)
    const isAllowed = checkRateLimit(`project_update_${session.user.id}`, 20, 60000);
    if (!isAllowed) {
      return NextResponse.json({ message: "Too many requests, please try again later." }, { status: 429 });
    }

    const body = await req.json();

    // Validate input payload
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.errors[0].message }, { status: 400 });
    }

    const data = parsed.data;

    const project = await Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Trigger Pusher Event [rt-event-trigger]
    try {
      await pusherServer.trigger("projects-channel", "project-updated", {
        projectId: id,
        userId: session.user.id,
      });
    } catch (e) {
      console.warn("Pusher trigger failed:", e.message);
    }

    if (data.orderStatus) {
      await Activity.create({
        userId: session.user.id,
        userName: session.user.name || "User",
        action: `changed status to ${data.orderStatus}`,
        target: project.orderId,
        projectId: project._id,
        type: "status"
      });

      try {
        const Notification = (await import("@/models/Notification")).default;
        const User = (await import("@/models/User")).default;
        
        const admins = await User.find({ role: "admin" });
        
        // Create notifications in DB
        const notificationsToCreate = admins.map(admin => ({
          userId: admin._id,
          title: "Project Status Updated",
          message: `${session.user.name} changed ${project.orderId} status to ${data.orderStatus}.`,
          type: "order",
          link: "/projects"
        }));
        
        // Notify the developer if it's not the one making the change
        if (project.developer?.id && project.developer.id.toString() !== session.user.id) {
          notificationsToCreate.push({
            userId: project.developer.id,
            title: "Project Status Updated",
            message: `${session.user.name} changed your project ${project.orderId} status to ${data.orderStatus}.`,
            type: "order",
            link: "/projects"
          });
        }
        
        const createdNotifications = await Notification.insertMany(notificationsToCreate);
        
        // Trigger Pusher for developer
        if (project.developer?.id && project.developer.id.toString() !== session.user.id) {
          const devNotif = createdNotifications.find(n => n.userId.toString() === project.developer.id.toString());
          if (devNotif) {
            await pusherServer.trigger(`user-${project.developer.id}`, "notification-received", devNotif);
          }
        }
        
        // Trigger Pusher for admins (one event for all admins)
        const adminNotif = createdNotifications.find(n => admins.some(a => a._id.toString() === n.userId.toString()));
        if (adminNotif) {
          await pusherServer.trigger("admin-channel", "notification-received", adminNotif);
        }
        
      } catch (notifErr) {
        console.error("Failed to create notifications:", notifErr);
      }
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update project", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  console.log(">>> DELETE API CALLED <<<");
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Fetch project to check ownership
    const { id } = await params;
    const projectToDelete = await Project.findById(id);

    if (!projectToDelete) {
      console.warn(`Project not found for deletion: ${id}`);
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Check permissions [rbac-enforcement]
    const isAdmin = session.user.role === "admin";
    const isCreator = projectToDelete.createdBy?.toString() === session.user.id;

    if (!isAdmin && !isCreator) {
      console.warn(`Unauthorized delete attempt by user ${session.user.id} on project ${id}`);
      return NextResponse.json({ message: "Forbidden: You do not have permission to delete this project" }, { status: 403 });
    }

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      console.warn(`Project not found for deletion: ${id}`);
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    console.log(`Project deleted: ${project.orderId} (${id})`);

    // Trigger Socket Event [rt-event-trigger]
    try {
      await pusherServer.trigger("projects-channel", "project-updated", {
        projectId: id,
        userId: session.user.id,
        action: "deleted"
      });
    } catch (e) {
      console.warn("Socket trigger failed:", e.message);
    }

    // Log Activity [audit-log]
    try {
      await Activity.create({
        userId: session.user.id,
        userName: session.user.name || "User",
        action: `deleted project`,
        target: project.orderId,
        type: "project"
      });
    } catch (e) {
      console.warn("Activity logging failed:", e.message);
    }

    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
