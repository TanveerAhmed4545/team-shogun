import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Activity from "@/models/Activity";
import User from "@/models/User";
import Notification from "@/models/Notification";

class ProjectService {
  async getAllProjects(filter = {}, limit = 0) {
    await dbConnect();
    let query = Project.find(filter).sort({ createdAt: -1 }).populate("developer.id", "name avatar");
    if (limit > 0) {
      query = query.limit(limit);
    }
    return query;
  }

  async createProject(data, currentUser) {
    await dbConnect();

    const project = await Project.create({
      ...data,
      createdBy: currentUser.id,
    });

    // 1. Log Activity
    await Activity.create({
      userId: currentUser.id,
      userName: currentUser.name || "User",
      action: "created project",
      target: project.orderId,
      projectId: project._id,
      type: "project"
    });

    // 2. Trigger Real-time Event
    let emitSocketEvent;
    try {
      const socketModule = await import("@/lib/socket-emitter");
      emitSocketEvent = socketModule.emitSocketEvent;
      await emitSocketEvent("projects-channel", "project-updated", {
        projectId: project._id,
        userId: currentUser.id,
        action: "created"
      });
    } catch (e) {
      console.warn("Socket trigger failed:", e.message);
    }

    // 3. Handle Notifications
    this.handleProjectNotifications(project, data, currentUser, emitSocketEvent).catch(err => 
      console.error("❌ Failed to process project notifications:", err)
    );

    return project;
  }

  async handleProjectNotifications(project, data, currentUser, emitSocketEvent) {
    const notificationPromises = [];
    
    // Notify Admins
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      const p = Notification.create({
        userId: admin._id,
        title: "New Project Created",
        message: `${currentUser.name} created order ${project.orderId}.`,
        type: "order",
        link: "/projects"
      }).then(async (notif) => {
        if (emitSocketEvent) {
          await emitSocketEvent("admin-channel", "notification-received", notif);
        }
      });
      notificationPromises.push(p);
    }

    // Notify Developer (if assigned and not the creator)
    if (data.developer?.name) {
      const assignedDev = await User.findOne({ name: data.developer.name });
      if (assignedDev && String(assignedDev._id) !== currentUser.id) {
        const p = Notification.create({
          userId: assignedDev._id,
          title: "Project Assigned",
          message: `You have been assigned to order ${project.orderId}.`,
          type: "order",
          link: "/projects"
        }).then(async (notif) => {
          if (emitSocketEvent) {
            await emitSocketEvent(`user-${assignedDev._id}`, "notification-received", notif);
          }
        });
        notificationPromises.push(p);
      }
    }
    
    await Promise.allSettled(notificationPromises);
  }
}

export const projectService = new ProjectService();
