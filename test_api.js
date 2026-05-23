const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Notification = require("./models/Notification").default || require("./models/Notification");
  
  // Fahid's ID
  const userId = "6a0833d9665897523457b8f2";
  
  const query = { userId };
  const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(30);
  
  console.log("Fahid Notifications from DB:");
  console.log(notifications);
  process.exit(0);
}
run();
