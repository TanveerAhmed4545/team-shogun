import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "moderator", "member"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "pending",
    },
    avatar: { type: String, default: "" },
    coverPhoto: { type: String, default: "" },
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    skills: [{ type: String }],
    performance_score: { type: Number, default: 0 },
    total_earnings: { type: Number, default: 0 },
    facebook: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    projects_completed: { type: Number, default: 0 },
    on_time_delivery: { type: Number, default: 100 },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      deadlineAlerts: { type: Boolean, default: true },
      paymentAlerts: { type: Boolean, default: true },
      monthlyTarget: { type: Number, default: 10000 }
    },
    requiresLogout: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
