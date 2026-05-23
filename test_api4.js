const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Notification = require("./models/Notification").default || require("./models/Notification");
  
  const allNotifs = await Notification.find({});
  const userIds = [...new Set(allNotifs.map(n => n.userId.toString()))];
  
  console.log("Total notifications:", allNotifs.length);
  console.log("Unique userIds:", userIds);
  
  process.exit(0);
}
run();
