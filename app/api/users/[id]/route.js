import { userService } from "@/lib/services/user.service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return ApiResponse.unauthorized();
    }

    const { id } = await params;
    const user = await userService.getUserById(id);
    if (!user) return ApiResponse.notFound("User not found");

    // Calculate dynamic stats from projects [qk-include-dependencies]
    const Project = (await import("@/models/Project")).default;
    const projects = await Project.find({
      $or: [
        { "developer.id": id },
        { "developer.name": user.name }
      ]
    });

    const wip = projects
      .filter(p => p.orderStatus === "WIP" || p.orderStatus === "Revision")
      .reduce((sum, p) => sum + (p.value || 0), 0);
        
    const delivered = projects
      .filter(p => p.orderStatus === "Delivered" || p.orderStatus === "Completed")
      .reduce((sum, p) => sum + (p.value || 0), 0);

    const completedProjects = projects.filter(p => p.orderStatus === "Delivered" || p.orderStatus === "Completed");
    const completedCount = completedProjects.length;

    const userObj = user.toObject();
    userObj.projects_completed = completedCount;
    userObj.total_earnings = delivered;
    userObj.performance_score = Math.round((wip + delivered) / 10);

    return ApiResponse.success({ user: userObj });
  } catch (error) {
    console.error("User GET Error:", error);
    return ApiResponse.error();
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return ApiResponse.unauthorized();
    }

    const { id } = await params;

    // Real-time Role Verification (Resilient check)
    const currentUser = await userService.getUserById(session.user.id);
    const isActuallyAdmin = currentUser?.role === "admin" || session.user.role === "admin";

    if (!isActuallyAdmin && session.user.id !== id) {
      return ApiResponse.forbidden();
    }

    const data = await req.json();
    if (data.password) delete data.password;

    // Security: Only admins can change role or status
    if (!isActuallyAdmin) {
      delete data.role;
      delete data.status;
    }

    // If role or status changes, force a logout for the target user
    if (data.role || data.status) {
      data.requiresLogout = true;
    }

    const user = await userService.updateUser(id, data);
    if (!user) return ApiResponse.notFound("User not found");

    // Log Activity & Trigger Pusher [rt-event-trigger]
    try {
      const { activityService } = await import("@/lib/services/activity.service");
      const { emitSocketEvent } = await import("@/lib/socket-emitter");
      
      let action = "updated profile";
      if (data.role) action = `changed role to ${data.role}`;
      if (data.status) action = `changed status to ${data.status}`;

      await activityService.logActivity({
        userId: session.user.id,
        userName: session.user.name,
        action: `${action} for ${user.name}`,
        type: "team"
      });

      await emitSocketEvent("team-channel", "team-updated", {
        userId: session.user.id,
        targetId: id
      });
    } catch (e) {
      console.warn("RT/Activity failed:", e.message);
    }

    return ApiResponse.success({ user }, "User updated successfully");
  } catch (error) {
    console.error("User PUT Error:", error);
    return ApiResponse.error("Failed to update user");
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return ApiResponse.unauthorized();

    const currentUser = await userService.getUserById(session.user.id);
    if (session.user.status !== "active" || currentUser?.role !== "admin") {
      return ApiResponse.forbidden();
    }

    const { id } = await params;
    const user = await userService.deleteUser(id);
    if (!user) return ApiResponse.notFound("User not found");

    // Log Activity & Trigger Pusher [rt-event-trigger]
    try {
      const { activityService } = await import("@/lib/services/activity.service");
      const { emitSocketEvent } = await import("@/lib/socket-emitter");

      await activityService.logActivity({
        userId: session.user.id,
        userName: session.user.name,
        action: `removed team member ${user.name}`,
        type: "team"
      });

      await emitSocketEvent("team-channel", "team-updated", {
        userId: session.user.id,
        action: "deleted"
      });
    } catch (e) {
      console.warn("RT/Activity failed:", e.message);
    }

    return ApiResponse.success(null, "User deleted successfully");
  } catch (error) {
    console.error("User DELETE Error:", error);
    return ApiResponse.error();
  }
}
