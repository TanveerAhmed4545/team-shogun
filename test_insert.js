const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Notification = require("./models/Notification").default || require("./models/Notification");
  
  const devId = new mongoose.Types.ObjectId();
  
  const notifs = await Notification.insertMany([{
    userId: devId,
    title: "Test",
    message: "Test Message",
    type: "system"
  }]);
  
  console.log("Returned from insertMany:", notifs[0]);
  console.log("n.userId.toString() === devId.toString() ?", notifs[0].userId.toString() === devId.toString());
  
  await Notification.deleteMany({ title: "Test" });
  process.exit(0);
}
run();
