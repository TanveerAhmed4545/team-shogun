import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    profileName: { type: String, required: true },
    orderId: { type: String, required: true },
    value: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    orderStatus: {
      type: String,
      enum: ["Pending", "WIP", "Revision", "Delivered", "Completed", "Cancelled"],
      default: "Pending",
    },
    developer: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: { type: String },
    },
    firstDraft: { type: String, default: "Pending" },
    deliveryDate: { type: Date },
    deadline: { type: Date, required: true },
    orderStart: { type: Date, default: Date.now },
    incomingDate: { type: Date },
    orderSheet: { type: String, default: "" },
    timeLeft: { type: String },
    priority: {
      type: String,
      enum: ["Green", "Yellow", "Red"],
      default: "Green",
    },
    remarks: { type: String, default: "" },
    star: { type: Number, default: 0, min: 0, max: 5 },
    progress: { type: Number, default: 0 },
    files: [{ type: String }],
    developerPayout: { type: Number, default: 0 },
    profitMargin: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
