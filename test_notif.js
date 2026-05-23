const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // get User model
  const userSchema = new mongoose.Schema({}, { strict: false });
  const User = mongoose.models.User || mongoose.model("User", userSchema);
  
  // get Notification model
  const notifSchema = new mongoose.Schema({}, { strict: false });
  const Notification = mongoose.models.Notification || mongoose.model("Notification", notifSchema);
  
  const users = await User.find({}, 'name email role');
  console.log("Users in DB:", users);

  const notifs = await Notification.find().sort({ createdAt: -1 }).limit(10);
  console.log("Last 10 Notifications:", notifs);
  
  process.exit(0);
}

run();
