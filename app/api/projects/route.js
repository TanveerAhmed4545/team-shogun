import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Activity from "@/models/Activity";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// Removed DEMO_PROJECTS

export async function GET(req) {
  try {
    const db = await dbConnect();

    if (!db) {
      return NextResponse.json({ projects: [] }, { status: 200 });
    }

    const projects = await Project.find({}).sort({ createdAt: -1 }).populate("developer.id", "name avatar");
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Projects GET Error:", error);
    return NextResponse.json({ projects: [] }, { status: 200 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ message: "Database not connected. Please add MONGODB_URI to .env.local" }, { status: 503 });
    }

    const data = await req.json();

    const project = await Project.create({
      ...data,
    });

    await Activity.create({
      userId: session.user.id,
      userName: session.user.name || "User",
      action: "created project",
      target: project.orderId,
      projectId: project._id,
      type: "project"
    });

    try {
      const Notification = (await import("@/models/Notification")).default;
      const User = (await import("@/models/User")).default;
      
      const notificationPromises = [];
      
      // Notify Admins
      const admins = await User.find({ role: "admin" });
      admins.forEach(admin => {
        notificationPromises.push(
          Notification.create({
            userId: admin._id,
            title: "New Project Created",
            message: `${session.user.name} created order ${project.orderId}.`,
            type: "order",
            link: "/projects"
          })
        );
      });

      // Notify Developer (if assigned)
      if (data.developer && data.developer.name) {
        const assignedDev = await User.findOne({ name: data.developer.name });
        if (assignedDev && String(assignedDev._id) !== session.user.id) {
          notificationPromises.push(
            Notification.create({
              userId: assignedDev._id,
              title: "Project Assigned",
              message: `You have been assigned to order ${project.orderId}.`,
              type: "order",
              link: "/projects"
            })
          );
        }
      }
      
      await Promise.all(notificationPromises);
    } catch (notifErr) {
      console.error("Failed to create notifications:", notifErr);
    }

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create project", error: error.message }, { status: 500 });
  }
}
