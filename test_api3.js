const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Notification = require("./models/Notification").default || require("./models/Notification");
  
  const userIdStr = "6a0833d9665897523457b8f2";
  const userIdObj = new mongoose.Types.ObjectId(userIdStr);
  
  const notifsStr = await Notification.find({ userId: userIdStr });
  const notifsObj = await Notification.find({ userId: userIdObj });
  
  console.log("With String length:", notifsStr.length);
  console.log("With ObjectId length:", notifsObj.length);
  
  const fahidNotifs = await Notification.find({}).then(all => all.filter(n => n.userId.toString() === userIdStr));
  console.log("Manual filter length:", fahidNotifs.length);

  process.exit(0);
}
run();
