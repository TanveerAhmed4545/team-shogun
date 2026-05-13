import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

// Removed static DEMO_ANALYTICS

export async function GET(req) {
  try {
    const db = await dbConnect();

    // If no database, return demo data
    if (!db) {
      return NextResponse.json({ totalProjects: 0, activeOrders: 0, revenue: 0, totalMembers: 0, completionRate: 0, cancelledRate: 0, statusDistribution: [], monthlyRevenue: [] }, { status: 200 });
    }

    const totalProjects = await Project.countDocuments();
    const activeOrders = await Project.countDocuments({
      orderStatus: { $in: ["Pending", "WIP", "Revision"] },
    });
    const completedCount = await Project.countDocuments({
      orderStatus: { $in: ["Delivered", "Completed"] },
    });
    const cancelledCount = await Project.countDocuments({
      orderStatus: "Cancelled",
    });

    // Revenue from completed or delivered projects
    const revenueData = await Project.aggregate([
      { $match: { orderStatus: { $in: ["Delivered", "Completed"] } } },
      { $group: { _id: null, totalRevenue: { $sum: "$value" } } },
    ]);
    const revenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    const totalMembers = await User.countDocuments({
      status: "active",
    });

    const completionRate =
      totalProjects > 0
        ? parseFloat(((completedCount / totalProjects) * 100).toFixed(1))
        : 0;
    const cancelledRate =
      totalProjects > 0
        ? parseFloat(((cancelledCount / totalProjects) * 100).toFixed(1))
        : 0;

    // Status distribution
    const statusCounts = await Project.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    const statusColors = {
      Pending: "#FACC15",
      WIP: "#3B82F6",
      Revision: "#EF4444",
      Delivered: "#8B5CF6",
      Completed: "#22C55E",
      Cancelled: "#6B7280",
    };

    const statusDistribution = statusCounts.map((s) => ({
      name: s._id,
      value: s.count,
      color: statusColors[s._id] || "#6B7280",
    }));

    // Calculate monthly revenue from transactions
    const currentYear = new Date().getFullYear();
    const monthlyData = await Transaction.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [
                { $in: ["$type", ["payout", "expense", "refund"]] },
                "$amount",
                0,
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyRevenue = months.map((month, index) => {
      const data = monthlyData.find((d) => d._id === index + 1);
      const rev = data ? data.revenue : 0;
      const exp = data ? data.expenses : 0;
      return {
        month,
        revenue: rev,
        profit: rev - exp,
      };
    });
    
    // Show only up to the current month to make the chart look nice
    const currentMonth = new Date().getMonth();
    const finalMonthlyRevenue = monthlyRevenue.slice(Math.max(0, currentMonth - 6), currentMonth + 1);

    return NextResponse.json(
      {
        totalProjects,
        activeOrders,
        revenue,
        totalMembers,
        completionRate,
        cancelledRate,
        statusDistribution,
        monthlyRevenue: finalMonthlyRevenue,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ totalProjects: 0, activeOrders: 0, revenue: 0, totalMembers: 0, completionRate: 0, cancelledRate: 0, statusDistribution: [], monthlyRevenue: [] }, { status: 200 });
  }
}
