const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Project = require("./models/Project").default || require("./models/Project");
  
  const projects = await Project.find({});
  console.log("Total projects:", projects.length);
  projects.forEach(p => {
    console.log(`Order: ${p.orderId}, DevName: '${p.developer?.name}', DevID: ${p.developer?.id}`);
  });
  
  process.exit(0);
}
run();
