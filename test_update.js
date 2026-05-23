const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Project = require("./models/Project").default || require("./models/Project");
  const User = require("./models/User").default || require("./models/User");
  const Notification = require("./models/Notification").default || require("./models/Notification");

  const fahid = await User.findOne({ email: "fahidaqundow@gmail.com" });
  console.log("Fahid ID:", fahid._id);

  // Find a project to update
  const project = await Project.findOne();
  if (!project) {
    console.log("No projects found!");
    process.exit(0);
  }

  console.log(`Testing with project: ${project.orderId}`);
  console.log(`Current dev:`, project.developer);

  // We'll mimic the exact logic from route.js
  const data = {
    developer: { name: "Fahid", id: fahid._id }
  };

  const existingProject = project;

  const notificationsToCreate = [];
  const sessionUserId = "6a080a6a5dde442c8346ee06"; // Tanveer

  // We bypass the string check to force it for the test
  if (true) {
    if (data.developer?.id && data.developer.id.toString() !== sessionUserId) {
      notificationsToCreate.push({
        userId: data.developer.id,
        title: "Project Assigned",
        message: `Admin assigned you to project TEST.`,
        type: "order",
        link: "/projects"
      });
    }
  }

  console.log("Notifications to create:", notificationsToCreate);

  if (notificationsToCreate.length > 0) {
    const createdNotifications = await Notification.insertMany(notificationsToCreate);
    console.log("Created:", createdNotifications);
    
    // Clean up
    await Notification.deleteMany({ _id: { $in: createdNotifications.map(n => n._id) } });
    console.log("Cleaned up test notifications.");
  }

  process.exit(0);
}

run();
