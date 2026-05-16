const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

// Minimal Schemas for maintenance tasks
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "member" },
  status: { type: String, default: "active" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

/**
 * PRODUCTION-SAFE SEED SCRIPT
 * This script ensures the base admin exists without wiping existing data.
 */
const seedDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in .env.local!");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected successfully!");

    // 1. Ensure Admin User Exists
    const adminEmail = "tanveer8507@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log(`🚀 Creating default admin: ${adminEmail}`);
      const hashedPassword = await bcrypt.hash("123456", 10);
      await User.create({
        name: "Tanveer Ahmed",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        status: "active"
      });
      console.log("✅ Admin created successfully.");
    } else {
      console.log(`ℹ️ Admin ${adminEmail} already exists. Skipping creation.`);
    }

    console.log("🎉 Database maintenance complete. No data was wiped.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during database maintenance:", error);
    process.exit(1);
  }
};

seedDatabase();
