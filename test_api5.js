const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const User = require("./models/User").default || require("./models/User");
  const fahid = await User.findOne({ email: "fahidaqundow@gmail.com" });
  
  console.log("Fahid _id:", fahid ? fahid._id.toString() : "Not found");
  process.exit(0);
}
run();
