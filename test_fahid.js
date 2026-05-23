const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const notifSchema = new mongoose.Schema({}, { strict: false });
  const Notification = mongoose.models.Notification || mongoose.model("Notification", notifSchema);
  
  const fahidId = new mongoose.Types.ObjectId('6a0833d9665897523457b8f2');
  const fahidNotifs = await Notification.find({ userId: fahidId }).sort({ createdAt: -1 }).limit(5);
  
  console.log("Current Fahid Notifications in DB:");
  console.log(fahidNotifs);
  
  process.exit(0);
}

run();
