import dbConnect from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";

class UserService {
  async getAllUsers(excludePasswords = true) {
    await dbConnect();
    let query = User.find({});
    if (excludePasswords) {
      query = query.select("-password");
    }
    return query.sort({ performance_score: -1 });
  }

  async getUserById(id) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;
    await dbConnect();
    return User.findById(id).select("-password");
  }

  async updateUser(id, data) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;
    await dbConnect();
    return User.findByIdAndUpdate(id, { $set: data }, { new: true }).select("-password");
  }

  async deleteUser(id) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;
    await dbConnect();
    return User.findByIdAndDelete(id);
  }
}

export const userService = new UserService();
