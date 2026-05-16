import { activityService } from "@/lib/services/activity.service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return ApiResponse.unauthorized();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const userId = session.user.role === "admin" ? null : session.user.id;
    const activities = await activityService.getRecentActivities(limit, userId);
    
    return ApiResponse.success({ activities });
  } catch (error) {
    console.error("Activities GET Error:", error);
    return ApiResponse.success({ activities: [] }, "Could not fetch activities");
  }
}
