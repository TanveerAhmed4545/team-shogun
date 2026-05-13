import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, default: "" },
    action: { type: String, required: true },
    target: { type: String, default: "" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    type: {
      type: String,
      enum: ["project", "status", "payment", "team", "system"],
      default: "system",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);
