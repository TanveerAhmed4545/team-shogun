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
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const projects = await Project.find({
      orderStatus: { $nin: ["Completed", "Delivered", "Cancelled"] },
      deadline: {
        $gte: now,
        $lte: tomorrow
      }
    });

    if (projects.length === 0) {
      return NextResponse.json({ message: "No approaching deadlines found." }, { status: 200 });
    }

    const tasks = [];

    for (const project of projects) {
      if (project.developer?.name) {
        const developer = await User.findOne({ name: project.developer.name });
        
        if (developer?.email) {
          // 1. Send Email via Service
          tasks.push(
            emailService.sendDeadlineEmail(developer.email, developer.name, project.orderId, project.deadline)
          );

          // 2. Create Notification
          tasks.push(
            Notification.create({
              userId: developer._id,
              title: "Deadline Approaching",
              message: `Warning: Order ${project.orderId} is due in less than 24 hours.`,
              type: "deadline",
              link: "/projects"
            })
          );
        }
      }
    }

    await Promise.allSettled(tasks);

    return NextResponse.json({ 
      message: `Processed ${projects.length} approaching deadlines.` 
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Cron Deadline Check Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
