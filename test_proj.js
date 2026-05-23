const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Project = require("./models/Project").default || require("./models/Project");

  const project = await Project.findOne({ orderId: "FO31BB2D0B785" });
  console.log("Project Developer Field:", project.developer);

  process.exit(0);
}

run();
