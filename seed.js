const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

// Define minimal schemas for seeding
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: { type: String, required: true },
  role: String,
  status: String,
  avatar: String,
  skills: [String],
  performance_score: Number,
  total_earnings: Number,
  projects_completed: Number,
  on_time_delivery: Number,
  createdAt: { type: Date, default: Date.now }
});

const ProjectSchema = new mongoose.Schema({
  clientName: String,
  profileName: String,
  orderId: String,
  value: Number,
  currency: { type: String, default: "USD" },
  orderStatus: String,
  developer: { name: String },
  deadline: Date,
  createdAt: { type: Date, default: Date.now }
});

const TransactionSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  description: String,
  category: String,
  status: String,
  reference: String,
  createdAt: { type: Date, default: Date.now }
});

const NotificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  type: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, default: "" },
  action: { type: String, required: true },
  target: { type: String, default: "" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  type: {
    type: String,
    enum: ["project", "status", "payment", "team", "system"],
    default: "system",
  },
}, { timestamps: true });
const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

const seedDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in .env.local!");
    console.log("Please add it and run this script again.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected successfully!");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Project.deleteMany({});
    await Transaction.deleteMany({});
    await Notification.deleteMany({});
    await Activity.deleteMany({});

    // Seed Users
    console.log("Seeding Users...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    const adminHashedPassword = await bcrypt.hash("12345", 10);
    const users = await User.insertMany([
      { name: "Tanveer Ahmed", email: "tanveer8507@gmail.com", password: adminHashedPassword, role: "admin", status: "active", skills: ["UI/UX Design", "React", "Figma"], performance_score: 98, total_earnings: 12500, projects_completed: 47, on_time_delivery: 96 },
      { name: "Alex Johnson", email: "alex@shogun.dev", password: hashedPassword, role: "member", status: "active", skills: ["SEO", "Content Writing"], performance_score: 92, total_earnings: 8200, projects_completed: 34, on_time_delivery: 91 },
      { name: "Sarah Kim", email: "sarah@shogun.dev", password: hashedPassword, role: "member", status: "active", skills: ["Web Development", "Next.js"], performance_score: 95, total_earnings: 10800, projects_completed: 41, on_time_delivery: 98 },
      { name: "Ravi Patel", email: "ravi@shogun.dev", password: hashedPassword, role: "member", status: "pending", skills: ["WordPress"], performance_score: 0, total_earnings: 0, projects_completed: 0, on_time_delivery: 0 }
    ]);

    // Seed Projects
    console.log("Seeding Projects...");
    await Project.insertMany([
      { clientName: "Marcus Chen", profileName: "ShogunDesign", orderId: "FO-78234", value: 450, orderStatus: "WIP", developer: { name: "Tanveer Ahmed" }, deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
      { clientName: "Sarah Mitchell", profileName: "ShogunSEO", orderId: "FO-78190", value: 280, orderStatus: "Pending", developer: { name: "Alex Johnson" }, deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
      { clientName: "James Rodriguez", profileName: "ShogunDesign", orderId: "FO-78102", value: 1200, orderStatus: "Revision", developer: { name: "Tanveer Ahmed" }, deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
      { clientName: "Emily Watson", profileName: "ShogunWeb", orderId: "FO-77998", value: 750, orderStatus: "Delivered", developer: { name: "Sarah Kim" }, deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { clientName: "David Kim", profileName: "ShogunSEO", orderId: "FO-77901", value: 320, orderStatus: "Completed", developer: { name: "Sarah Kim" }, deadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
    ]);

    // Seed Transactions
    console.log("Seeding Transactions...");
    await Transaction.insertMany([
      { type: "income", amount: 450, description: "E-commerce UI Design - Marcus Chen", category: "project_payment", status: "completed", reference: "FO-78234", createdAt: new Date(Date.now() - 1 * 86400000) },
      { type: "payout", amount: 180, description: "Developer Payout - Alex Johnson", category: "team_payout", status: "completed", reference: "PAY-001", createdAt: new Date(Date.now() - 1 * 86400000) },
      { type: "expense", amount: 49, description: "Figma Pro Subscription", category: "tool_subscription", status: "completed", reference: "SUB-FIG", createdAt: new Date(Date.now() - 3 * 86400000) },
      { type: "refund", amount: 100, description: "Partial refund - Order #FO-77850", category: "refund", status: "completed", reference: "REF-001", createdAt: new Date(Date.now() - 5 * 86400000) }
    ]);

    // Seed Notifications
    console.log("Seeding Notifications...");
    await Notification.insertMany([
      { title: "New Order Received", message: "Marcus Chen placed order FO-78234 for E-commerce UI Design ($450)", type: "order", read: false, createdAt: new Date(Date.now() - 1 * 3600000) },
      { title: "Payment Confirmed", message: "Payment of $1,200 received for order FO-78102 from James Rodriguez", type: "payment", read: false, createdAt: new Date(Date.now() - 3 * 3600000) },
      { title: "Team Member Joined", message: "Ravi Patel has requested access to Team Shogun — pending approval", type: "team", read: true, createdAt: new Date(Date.now() - 12 * 3600000) }
    ]);

    // Seed Activities
    console.log("Seeding Activities...");
    await Activity.insertMany([
      { userId: users[0]._id, userName: "Tanveer Ahmed", action: "created project", target: "FO-78234", type: "project", createdAt: new Date(Date.now() - 1 * 3600000) },
      { userId: users[1]._id, userName: "Alex Johnson", action: "changed status to WIP", target: "FO-78190", type: "status", createdAt: new Date(Date.now() - 3 * 3600000) },
      { userId: users[0]._id, userName: "System", action: "payment received", target: "$1,200", type: "payment", createdAt: new Date(Date.now() - 5 * 3600000) },
      { userId: users[3]._id, userName: "Ravi Patel", action: "requested access", target: "", type: "team", createdAt: new Date(Date.now() - 8 * 3600000) },
      { userId: users[2]._id, userName: "Sarah Kim", action: "delivered order", target: "FO-77998", type: "status", createdAt: new Date(Date.now() - 12 * 3600000) }
    ]);

    console.log("🎉 Database seeded successfully! All data is now dynamic.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
