import dbConnect from "@/lib/db";
import Activity from "@/models/Activity";

class ActivityService {
  async getRecentActivities(limit = 10, userId = null) {
    await dbConnect();
    const query = userId ? { userId } : {};
    return Activity.find(query).sort({ createdAt: -1 }).limit(limit);
  }

  async logActivity({ userId, userName, action, target, projectId, type = "project" }) {
    await dbConnect();
    return Activity.create({
      userId,
      userName,
      action,
      target,
      projectId,
      type
    });
  }
}

export const activityService = new ActivityService();
