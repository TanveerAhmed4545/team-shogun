import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Project from "@/models/Project";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Temporarily disabled session check for testing or public view
    // const session = await getServerSession(authOptions);
    // if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const users = await User.aggregate([
      { $match: { status: "active" } },
      {
        $lookup: {
          from: "projects",
          let: { userId: "$_id", userName: "$name" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$developer.id", "$$userId"] },
                    { $eq: ["$developer.name", "$$userName"] }
                  ]
                }
              }
            }
          ],
          as: "projects"
        }
      },
      {
        $addFields: {
          wipProjects: {
            $filter: {
              input: "$projects",
              as: "p",
              cond: { $in: ["$$p.orderStatus", ["WIP", "Revision"]] }
            }
          },
          completedProjects: {
            $filter: {
              input: "$projects",
              as: "p",
              cond: { $in: ["$$p.orderStatus", ["Delivered", "Completed"]] }
            }
          },
          cancelledProjects: {
            $filter: {
              input: "$projects",
              as: "p",
              cond: { $eq: ["$$p.orderStatus", "Cancelled"] }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          avatar: 1,
          email: 1,
          role: 1,
          skills: 1,
          target: { $ifNull: ["$preferences.monthlyTarget", 1100] },
          wip: { $sum: "$wipProjects.value" },
          delivered: { $sum: "$completedProjects.value" },
          cancelled: { $sum: "$cancelledProjects.value" },
          stars: {
            $size: {
              $filter: {
                input: "$completedProjects",
                as: "p",
                cond: { $eq: ["$$p.star", 5] }
              }
            }
          },
          projectCount: { $size: "$projects" },
          completedCount: { $size: "$completedProjects" },
          // Developer Efficiency & Delivery Speed
          avgDeliveryTimeDays: {
            $avg: {
              $map: {
                input: "$completedProjects",
                as: "p",
                in: {
                  $divide: [
                    { $subtract: [{ $ifNull: ["$$p.deliveryDate", "$$p.updatedAt"] }, "$$p.createdAt"] },
                    1000 * 60 * 60 * 24 // ms to days
                  ]
                }
              }
            }
          }
        }
      },
      {
        $addFields: {
          totalActive: { $add: ["$wip", "$delivered"] },
        }
      },
      {
        $addFields: {
          need: { $subtract: ["$target", "$totalActive"] },
          // Efficiency Score (Value delivered per day taken)
          efficiencyScore: {
            $cond: [
              { $gt: ["$avgDeliveryTimeDays", 0] },
              { $divide: ["$delivered", "$avgDeliveryTimeDays"] },
              0
            ]
          }
        }
      },
      { $sort: { totalActive: -1 } }
    ]);

    const performanceData = users;
    const topPerformer = performanceData[0] || null;

    return NextResponse.json({
      success: true,
      data: {
        performance: performanceData,
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
