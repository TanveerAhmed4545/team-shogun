const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const notifSchema = new mongoose.Schema({}, { strict: false });
  const Notification = mongoose.models.Notification || mongoose.model("Notification", notifSchema);

  // Fahid's ID
  const fahidId = new mongoose.Types.ObjectId('6a0833d9665897523457b8f2');

  // Insert notification
  const notif = await Notification.create({
    userId: fahidId,
    title: "Project Assigned",
    message: "Admin has assigned you to order MAGIC-TEST-999.",
    type: "order",
    read: false,
    link: "/projects"
  });

  console.log("Notification created in DB:", notif);

  // Trigger real-time socket event
  const { emitSocketEvent } = require("./lib/socket-emitter");
  await emitSocketEvent(`user-${fahidId.toString()}`, "notification-received", notif);
  
  console.log("Socket event fired to user channel!");
  process.exit(0);
}

run();
