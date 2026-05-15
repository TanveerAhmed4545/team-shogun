import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();

    // Fetch all active developers
    const users = await User.find({ status: "active" }).select("name avatar preferences role stars");

    // Fetch all projects to calculate performance
    const projects = await Project.find({});

    const performanceData = users.map(user => {
      const userProjects = projects.filter(p => 
        p.developer?.id?.toString() === user._id.toString() || 
        (p.developer?.name && p.developer.name === user.name)
      );
      
      const wip = userProjects
        .filter(p => p.orderStatus === "WIP" || p.orderStatus === "Revision")
        .reduce((sum, p) => sum + (p.value || 0), 0);
        
      const delivered = userProjects
        .filter(p => p.orderStatus === "Delivered" || p.orderStatus === "Completed")
        .reduce((sum, p) => sum + (p.value || 0), 0);
        
      const cancelled = userProjects
        .filter(p => p.orderStatus === "Cancelled")
        .reduce((sum, p) => sum + (p.value || 0), 0);

      const target = user.preferences?.monthlyTarget || 1100;
      const totalActive = wip + delivered; // WIP + Delivered as per user screenshot
      const need = target - totalActive;

      const completedCount = userProjects.filter(p => p.orderStatus === "Delivered" || p.orderStatus === "Completed").length;

      return {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        wip,
        cancelled,
        delivered,
        totalActive,
        target,
        need,
        stars: user.stars || 0,
        projectCount: userProjects.length,
        completedCount
      };
    });

    // Sort by totalActive to find top performer
    const sorted = [...performanceData].sort((a, b) => b.totalActive - a.totalActive);
    const topPerformer = sorted[0] || null;

    return NextResponse.json({
      success: true,
      data: {
        performance: sorted,
        topPerformer,
        totalWip: performanceData.reduce((sum, d) => sum + d.wip, 0),
        totalCancelled: performanceData.reduce((sum, d) => sum + d.cancelled, 0),
        totalDelivered: performanceData.reduce((sum, d) => sum + d.delivered, 0),
        totalActiveAll: performanceData.reduce((sum, d) => sum + d.totalActive, 0),
        totalStars: performanceData.reduce((sum, d) => sum + d.stars, 0)
      }
    });
  } catch (error) {
    console.error("Performance API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
