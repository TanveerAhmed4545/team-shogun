import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { emailService } from "@/lib/services/email.service";
import { config } from "@/lib/config";

export async function GET(req) {
  try {
    // 1. Security check
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${config.CRON_SECRET}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in72h = new Date(now.getTime() + 72 * 60 * 60 * 1000);

    // Find projects due soon that haven't been notified yet
    const projects = await Project.find({
      orderStatus: { $nin: ["Completed", "Delivered", "Cancelled"] },
      $or: [
        { deadline: { $lte: in24h, $gte: now }, notified24h: { $ne: true } },
        { deadline: { $lte: in72h, $gte: now }, notified72h: { $ne: true } }
      ]
    });

    if (projects.length === 0) {
      return NextResponse.json({ message: "No new deadlines to process." }, { status: 200 });
    }

    let count = 0;
    for (const project of projects) {
      const hoursLeft = Math.round((project.deadline.getTime() - now.getTime()) / (1000 * 60 * 60));
      let alertType = "";

      if (hoursLeft <= 24 && !project.notified24h) {
        alertType = "24h";
        project.notified24h = true;
        project.notified72h = true; // Also mark 72h as done if we missed it
      } else if (hoursLeft <= 72 && !project.notified72h) {
        alertType = "72h";
        project.notified72h = true;
      }

      if (alertType) {
        if (project.developer?.id || project.developer?.name) {
          const developer = await User.findOne({ 
            $or: [{ _id: project.developer.id }, { name: project.developer.name }] 
          });
          
          if (developer) {
            // 1. Create Notification
            await Notification.create({
              userId: developer._id,
              title: `${alertType === "24h" ? "🔥 CRITICAL" : "⚠️ WARNING"}: Deadline Approaching`,
              message: `Order ${project.orderId} is due in ${hoursLeft} hours. Please ensure delivery.`,
              type: "deadline",
              link: "/projects"
            });

            // 2. Send Email for both stages
            if (developer.email) {
              const urgency = alertType === "24h" ? "🔥 CRITICAL" : "⚠️ WARNING";
              await emailService.sendDeadlineEmail(
                developer.email, 
                developer.name, 
                project.orderId, 
                project.deadline,
                urgency
              ).catch(e => console.error("Email failed:", e));
            }
            
            await project.save();
            count++;
          }
        }
      }
    }

    return NextResponse.json({ 
      message: `Processed ${count} approaching deadlines.` 
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Cron Deadline Check Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
