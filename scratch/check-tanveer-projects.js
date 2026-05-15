const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load .env.local
try {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const index = line.indexOf('=');
      if (index > 0) {
        const key = line.substring(0, index).trim();
        const value = line.substring(index + 1).trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.error("Failed to load .env.local", e);
}

const dbConnect = require('../lib/db').default;
const Project = require('../models/Project').default;
const User = require('../models/User').default;

async function check() {
  try {
    await dbConnect();
    const user = await User.findOne({ name: "Tanveer Ahmed" });
    if (!user) {
      console.log("User not found");
      process.exit(1);
    }
    
    const projectsByName = await Project.find({ "developer.name": "Tanveer Ahmed" });
    console.log("Projects by Name:", projectsByName.length);
    projectsByName.forEach(p => console.log(`- ${p.orderId}: Status = ${p.orderStatus}, Value = ${p.value}`));
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

check();
