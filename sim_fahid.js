const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Project = require("./models/Project").default || require("./models/Project");
  const User = require("./models/User").default || require("./models/User");
  const Notification = require("./models/Notification").default || require("./models/Notification");
  const Activity = require("./models/Activity").default || require("./models/Activity");

  const fahid = await User.findOne({ email: "fahidaqundow@gmail.com" });
  console.log("Fahid:", fahid);

  // Find a project to update
  const project = await Project.findOne({ "developer.id": fahid._id });
  if (!project) {
    console.log("No projects assigned to Fahid!");
    process.exit(0);
  }

  console.log(`Testing with project: ${project.orderId}`);

  // Simulating the API route logic as Fahid changing the status
  const data = { orderStatus: "Delivered" };
  const sessionUser = {
    id: fahid._id.toString(),
    name: fahid.name,
    role: fahid.role
  };

  const admins = await User.find({ role: "admin" });
  const notificationsToCreate = [];

  // Notify about status change
  if (data.orderStatus) {
    admins.forEach(admin => {
      notificationsToCreate.push({
        userId: admin._id,
        title: "Project Status Updated",
        message: `${sessionUser.name} changed ${project.orderId} status to ${data.orderStatus}.`,
        type: "order"
      });
    });
    
    if (project.developer?.id && project.developer.id.toString() !== sessionUser.id) {
      notificationsToCreate.push({
        userId: project.developer.id,
        title: "Project Status Updated",
        message: `${sessionUser.name} changed your project ${project.orderId} status to ${data.orderStatus}.`,
        type: "order"
      });
    }
  }

  console.log("Notifications that would be created:");
  console.log(notificationsToCreate);

  process.exit(0);
}

run();
