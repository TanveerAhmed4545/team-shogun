import { activityService } from "@/lib/services/activity.service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return ApiResponse.unauthorized();

    const userId = session.user.role === "admin" ? null : session.user.id;
    const activities = await activityService.getRecentActivities(10, userId);
    
    return ApiResponse.success({ activities });
  } catch (error) {
    console.error("Activities GET Error:", error);
    return ApiResponse.success({ activities: [] }, "Could not fetch activities");
  }
}
