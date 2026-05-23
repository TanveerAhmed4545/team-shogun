const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Project = require("./models/Project").default || require("./models/Project");
  const User = require("./models/User").default || require("./models/User");

  // Get all projects that have a developer name but NO developer ID
  const brokenProjects = await Project.find({
    "developer.name": { $exists: true, $ne: "" },
    "developer.id": { $exists: false }
  });

  console.log(`Found ${brokenProjects.length} broken projects to fix.`);

  let fixCount = 0;
  for (const p of brokenProjects) {
    const dev = await User.findOne({ name: p.developer.name });
    if (dev) {
      p.developer.id = dev._id;
      await p.save();
      fixCount++;
      console.log(`Repaired project: ${p.orderId} (Assigned ID for ${p.developer.name})`);
    }
  }

  console.log(`Successfully repaired ${fixCount} projects!`);
  process.exit(0);
}

run();
