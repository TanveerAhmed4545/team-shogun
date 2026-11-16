import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Activity from "@/models/Activity";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 });

    await dbConnect();

    // Fetch last 6 months of activity for the user
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const activities = await Activity.find({
      userId: id,
      createdAt: { $gte: sixMonthsAgo }
    }).sort({ createdAt: 1 }).lean();

    // Group by date
    const activityMap = {};
    activities.forEach(activity => {
      const date = new Date(activity.createdAt).toISOString().split('T')[0];
      activityMap[date] = (activityMap[date] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      data: activityMap
    });
  } catch (error) {
    console.error("Activity API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
