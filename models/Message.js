import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    sender: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      avatar: { type: String, default: "" },
    },
    content: { type: String, required: true },
    attachments: [
      {
        url: { type: String },
        name: { type: String },
        type: { type: String },
      }
    ],
  },
  { timestamps: true }
);

// Index for fast retrieval of messages per project
MessageSchema.index({ projectId: 1, createdAt: -1 });

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
