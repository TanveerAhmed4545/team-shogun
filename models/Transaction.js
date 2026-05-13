import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["income", "expense", "payout", "refund"],
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["project_payment", "team_payout", "tool_subscription", "marketing", "refund", "bonus", "other"],
      default: "other",
    },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "completed",
    },
    reference: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
