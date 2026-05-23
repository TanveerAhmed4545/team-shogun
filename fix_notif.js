const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const notifSchema = new mongoose.Schema({}, { strict: false });
  const Notification = mongoose.models.Notification || mongoose.model("Notification", notifSchema);

  // Delete the malformed test notification
  await Notification.deleteMany({ message: "Admin has assigned you to order MAGIC-TEST-999." });

  console.log("Broken notification deleted!");
  process.exit(0);
}

run();
