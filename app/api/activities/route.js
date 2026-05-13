import { activityService } from "@/lib/services/activity.service";
import { ApiResponse } from "@/lib/utils/api-response";

export async function GET(req) {
  try {
    const activities = await activityService.getRecentActivities();
    return ApiResponse.success({ activities });
  } catch (error) {
    console.error("Activities GET Error:", error);
    return ApiResponse.success({ activities: [] }, "Could not fetch activities");
  }
}
