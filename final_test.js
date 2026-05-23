const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Use the REAL schema so timestamps are added
  const Notification = require("./models/Notification").default || require("./models/Notification");
  const fahidId = new mongoose.Types.ObjectId('6a0833d9665897523457b8f2');

  // Insert the notification
  const notif = await Notification.create({
    userId: fahidId,
    title: "System Test Successful",
    message: "This is a live test from your AI. The notification system is working perfectly!",
    type: "system",
    read: false,
    link: "/notifications"
  });

  console.log("Created beautiful real notification:", notif);

  // Emit it live!
  const { emitSocketEvent } = require("./lib/socket-emitter");
  await emitSocketEvent(`user-${fahidId.toString()}`, "notification-received", notif);
  
  process.exit(0);
}

run();
