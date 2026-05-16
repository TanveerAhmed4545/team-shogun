import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dbConnect from "../lib/db.js";
import User from "../models/User.js";
import Project from "../models/Project.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });


async function checkDB() {
  await dbConnect();
  const userCount = await User.countDocuments();
  const activeUsers = await User.countDocuments({ status: "active" });
  const projectCount = await Project.countDocuments();
  
  console.log({
    userCount,
    activeUsers,
    projectCount
  });
  
  const users = await User.find({ status: "active" }).limit(5);
  console.log("Active Users Sample:", users.map(u => ({ id: u._id, name: u.name, avatar: u.avatar, status: u.status })));
  
  process.exit(0);
}

checkDB().catch(err => {
  console.error(err);
  process.exit(1);
});
