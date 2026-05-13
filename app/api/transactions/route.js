import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";

// Removed DEMO_TRANSACTIONS

export async function GET() {
  try {
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ transactions: [] }, { status: 200 });
    }
    const transactions = await Transaction.find({}).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ transactions: [] }, { status: 200 });
  }
}

export async function POST(req) {
  try {
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ message: "Database not connected" }, { status: 503 });
    }
    const data = await req.json();
    const transaction = await Transaction.create(data);

    try {
      const Notification = (await import("@/models/Notification")).default;
      const User = (await import("@/models/User")).default;
      
      const admins = await User.find({ role: "admin" });
      const notificationPromises = admins.map(admin => 
        Notification.create({
          userId: admin._id,
          title: "New Transaction",
          message: `A new transaction of $${transaction.amount} was recorded for ${transaction.clientName}.`,
          type: "payment",
          link: "/analytics"
        })
      );
      await Promise.all(notificationPromises);
    } catch (notifErr) {
      console.error("Failed to create notifications:", notifErr);
    }

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create transaction", error: error.message }, { status: 500 });
  }
}
