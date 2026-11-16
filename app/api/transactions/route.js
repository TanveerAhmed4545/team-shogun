import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Admin access required" }, { status: 403 });
    }

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
          link: "/dashboard"
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
