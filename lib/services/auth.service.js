import dbConnect from "@/lib/db";
import User from "@/models/User";
import Notification from "@/models/Notification";
import bcrypt from "bcryptjs";

class AuthService {
  async registerUser({ name, email, password, role = "member" }) {
    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status: "pending",
    });

    // Notify Admins
    this.notifyAdminsOfNewRegistration(newUser).catch(err => 
      console.error("❌ Failed to notify admins of new registration:", err)
    );

    return newUser;
  }

  async notifyAdminsOfNewRegistration(user) {
    const admins = await User.find({ role: "admin" });
    const notificationPromises = admins.map(async (admin) => {
      const notif = await Notification.create({
        userId: admin._id,
        title: "New User Registration",
        message: `${user.name} (${user.email}) has registered and is awaiting approval.`,
        type: "team",
        link: "/team"
      });
      
      try {
        const { emitSocketEvent } = await import("@/lib/socket-emitter");
        await emitSocketEvent("admin-channel", "notification-received", notif);
      } catch (err) {
        console.error("Socket emit failed for new registration:", err);
      }
      
      return notif;
    });
    await Promise.allSettled(notificationPromises);
  }
}

export const authService = new AuthService();
