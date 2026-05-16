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

    // Emitting real-time event through our internal Pusher adapter (which calls the local socket server)
    try {
      const { pusherServer } = await import("@/lib/pusher");
      await pusherServer.trigger(`chat-${projectId}`, "new-message", message);
    } catch (e) {
      console.error("Failed to emit socket event:", e);
    }

    return ApiResponse.success({ message }, "Message sent", 201);
  } catch (error) {
    console.error("Messages POST Error:", error);
    return ApiResponse.error("Failed to send message");
  }
}
