import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["draft", "sent", "paid"],
      default: "draft",
    },
    dueDate: { type: Date },
    clientName: { type: String },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
