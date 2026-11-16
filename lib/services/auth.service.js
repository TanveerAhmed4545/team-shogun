import dbConnect from "@/lib/db";
import User from "@/models/User";
import Notification from "@/models/Notification";
import bcrypt from "bcryptjs";

class AuthService {
  async registerUser({ name, email, password }) {
    await dbConnect();

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Hardened: New registrations are ALWAYS 'member' with 'pending' status
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "member",
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
