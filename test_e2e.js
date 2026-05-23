const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  const User = require("./models/User").default || require("./models/User");
  const Project = require("./models/Project").default || require("./models/Project");
  const Notification = require("./models/Notification").default || require("./models/Notification");
  const Message = require("./models/Message").default || require("./models/Message");

  const admin = await User.findOne({ role: "admin" });
  const fahid = await User.findOne({ email: "fahidaqundow@gmail.com" });

  if (!admin || !fahid) {
    console.log("Could not find admin or fahid in DB.");
    process.exit(1);
  }

  // Find a project assigned to Fahid
  const project = await Project.findOne({ "developer.id": fahid._id });
  
  if (!project) {
    console.log("No project found for Fahid.");
    process.exit(1);
  }

  console.log("--- TEST 1: Admin changes project status ---");
  // Simulate API route logic for Admin changing status
  const orderStatus = "Completed";
  const notificationsToCreate = [];
  
  if (project.developer?.id && project.developer.id.toString() !== admin._id.toString()) {
    notificationsToCreate.push({
      userId: project.developer.id,
      title: "Project Status Updated",
      message: `${admin.name} changed your project ${project.orderId} status to ${orderStatus}.`,
      type: "order",
      link: "/projects"
    });
  }

  if (notificationsToCreate.length > 0) {
    const created = await Notification.insertMany(notificationsToCreate);
    console.log("✅ Database: Notification created for Fahid:", created[0]);
    
    // Simulate socket emission
    const devNotifs = created.filter(n => n.userId.toString() === project.developer.id.toString());
    console.log(`✅ Socket: Would emit to user-${project.developer.id} with ${devNotifs.length} notifications`);
  } else {
    console.log("❌ Failed to create notification for Fahid");
  }

  console.log("\n--- TEST 2: Fahid sends a chat message ---");
  // Simulate Fahid sending a message
  const content = "Hello Admin, this is a test message from Fahid!";
  
  const message = await Message.create({
    projectId: project._id,
    sender: {
      id: fahid._id,
      name: fahid.name,
      avatar: fahid.avatar || "",
    },
    content,
    attachments: [],
  });
  console.log("✅ Database: Message created.");

  // Simulate API route logic for notifying Admin
  if (fahid.role !== "admin") {
    const admins = await User.find({ role: "admin" });
    const adminNotifs = await Promise.all(admins.map(a => 
      Notification.create({
        userId: a._id,
        title: "New Message",
        message: `${fahid.name} sent a message in project ${project.orderId}`,
        type: "system",
        link: `/projects/${project._id}`
      })
    ));
    console.log("✅ Database: Notifications created for Admins:", adminNotifs.length);
    console.log(`✅ Socket: Would emit to user-${adminNotifs[0].userId} and admin-channel`);
  }

  process.exit(0);
}

run();
