import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Activity from "@/models/Activity";
const { pusherServer } = require("@/lib/pusher");

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

    const data = await req.json();

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
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const User = (await import("@/models/User")).default;
    const currentUser = await User.findById(session.user.id);

    if (currentUser?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Admin access only" }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Trigger Pusher Event [rt-event-trigger]
    try {
      await pusherServer.trigger("projects-channel", "project-updated", {
        projectId: id,
        userId: session.user.id,
        action: "deleted"
      });
    } catch (e) {
      console.warn("Pusher trigger failed:", e.message);
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
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
