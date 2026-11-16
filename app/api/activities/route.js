import { activityService } from "@/lib/services/activity.service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") return ApiResponse.unauthorized();

    const { searchParams } = new URL(req.url);
    const rawLimit = parseInt(searchParams.get("limit") || "10", 10);
    const limit = Math.max(1, Math.min(isNaN(rawLimit) ? 10 : rawLimit, 100));
    const userId = session.user.role === "admin" ? null : session.user.id;
    const activities = await activityService.getRecentActivities(limit, userId);
    
    return ApiResponse.success({ activities });
  } catch (error) {
    console.error("Activities GET Error:", error);
    return ApiResponse.success({ activities: [] }, "Could not fetch activities");
  }
}
