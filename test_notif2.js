const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const notifSchema = new mongoose.Schema({}, { strict: false });
  const Notification = mongoose.models.Notification || mongoose.model("Notification", notifSchema);
  
  const fahidNotifs = await Notification.find({ userId: new mongoose.Types.ObjectId('6a0833d9665897523457b8f2') }).sort({ createdAt: -1 }).limit(10);
  console.log("Fahid Notifications:", fahidNotifs);
  
  const akibNotifs = await Notification.find({ userId: new mongoose.Types.ObjectId('6a083440665897523457b8f4') }).sort({ createdAt: -1 }).limit(10);
  console.log("Akib Notifications:", akibNotifs);

  process.exit(0);
}

run();
