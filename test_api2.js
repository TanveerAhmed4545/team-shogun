const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Notification = require("./models/Notification").default || require("./models/Notification");
  
  const allNotifs = await Notification.find({});
  console.log("Total notifications:", allNotifs.length);
  if (allNotifs.length > 0) {
    console.log("Sample:", allNotifs[0]);
  }
  
  process.exit(0);
}
run();
