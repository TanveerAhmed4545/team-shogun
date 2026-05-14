import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Activity from "@/models/Activity";
import User from "@/models/User";
import Notification from "@/models/Notification";

class ProjectService {
  async getAllProjects() {
    await dbConnect();
    return Project.find({}).sort({ createdAt: -1 }).populate("developer.id", "name avatar");
  }

  async createProject(data, currentUser) {
    await dbConnect();

    const project = await Project.create({
      ...data,
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
    try {
      const { pusherServer } = await import("@/lib/pusher");
      await pusherServer.trigger("projects-channel", "project-updated", {
        projectId: project._id,
        userId: currentUser.id,
        action: "created"
      });
    } catch (e) {
      console.warn("Pusher trigger failed:", e.message);
    }

    // 3. Handle Notifications
    this.handleProjectNotifications(project, data, currentUser).catch(err => 
      console.error("❌ Failed to process project notifications:", err)
    );

    return project;
  }

  async handleProjectNotifications(project, data, currentUser) {
    const notificationPromises = [];
    
    // Notify Admins
    const admins = await User.find({ role: "admin" });
    admins.forEach(admin => {
      notificationPromises.push(
        Notification.create({
          userId: admin._id,
          title: "New Project Created",
          message: `${currentUser.name} created order ${project.orderId}.`,
          type: "order",
          link: "/projects"
        })
      );
    });

    // Notify Developer (if assigned and not the creator)
    if (data.developer?.name) {
      const assignedDev = await User.findOne({ name: data.developer.name });
      if (assignedDev && String(assignedDev._id) !== currentUser.id) {
        notificationPromises.push(
          Notification.create({
            userId: assignedDev._id,
            title: "Project Assigned",
            message: `You have been assigned to order ${project.orderId}.`,
            type: "order",
            link: "/projects"
          })
        );
      }
    }
    
    await Promise.allSettled(notificationPromises);
  }
}

export const projectService = new ProjectService();
