const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Notification = require("./models/Notification").default || require("./models/Notification");
  
  const akibNotifs = await Notification.find({ userId: "6a083440665897523457b8f4" }).sort({ createdAt: -1 }).limit(5);
  console.log("Akib Notifications:", akibNotifs);
  
  process.exit(0);
}
run();
