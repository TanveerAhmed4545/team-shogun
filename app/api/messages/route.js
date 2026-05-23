import { ApiResponse } from "@/lib/utils/api-response";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Message from "@/models/Message";
import Project from "@/models/Project";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return ApiResponse.unauthorized();

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return ApiResponse.error("Project ID is required");
    }

    await dbConnect();
    
    // Ensure user has access to the project
    const project = await Project.findById(projectId);
    if (!project) return ApiResponse.notFound("Project not found");
    
    // Restrict access if necessary (Optional, assuming team members have access)

    const messages = await Message.find({ projectId }).sort({ createdAt: 1 });
    
    return ApiResponse.success({ messages });
  } catch (error) {
    console.error("Messages GET Error:", error);
    return ApiResponse.error("Could not fetch messages");
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return ApiResponse.unauthorized();

    const data = await req.json();
    const { projectId, content, attachments } = data;

    if (!projectId || !content) {
      return ApiResponse.error("Project ID and content are required");
    }

    await dbConnect();
    
    const project = await Project.findById(projectId);
    if (!project) return ApiResponse.notFound("Project not found");

    const message = await Message.create({
      projectId,
      sender: {
        id: session.user.id,
        name: session.user.name,
        avatar: session.user.avatar || "",
      },
      content,
      attachments: attachments || [],
    });

    // Emitting real-time event through our standalone socket server
    try {
      const { emitSocketEvent } = await import("@/lib/socket-emitter");
      await emitSocketEvent(`chat-${projectId}`, "new-message", message);
      
      const Notification = (await import("@/models/Notification")).default;
      const User = (await import("@/models/User")).default;
      
      // Send notification to the other party
      if (project.developer?.id && session.user.id !== project.developer.id.toString()) {
        // Admin sent message, notify developer
        const notif = await Notification.create({
          userId: project.developer.id,
          title: "New Message",
          message: `${session.user.name} sent a message in project ${project.orderId}`,
          type: "system",
          link: `/projects/${projectId}`
        });
        await emitSocketEvent(`user-${project.developer.id}`, "notification-received", notif);
      } else if (session.user.role !== "admin") {
        // Developer sent message, notify admins
        const admins = await User.find({ role: "admin" });
        const adminNotifs = await Promise.all(admins.map(admin => 
          Notification.create({
            userId: admin._id,
            title: "New Message",
            message: `${session.user.name} sent a message in project ${project.orderId}`,
            type: "system",
            link: `/projects/${projectId}`
          })
        ));
        for (const notif of adminNotifs) {
          await emitSocketEvent(`user-${notif.userId}`, "notification-received", notif);
        }
        // Also emit to general admin channel
        if (adminNotifs.length > 0) {
          await emitSocketEvent("admin-channel", "notification-received", adminNotifs[0]);
        }
      }
    } catch (e) {
      console.error("Failed to emit socket event or notification:", e);
    }

    return ApiResponse.success({ message }, "Message sent", 201);
  } catch (error) {
    console.error("Messages POST Error:", error);
    return ApiResponse.error("Failed to send message");
  }
}
