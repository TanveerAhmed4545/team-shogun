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
    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create transaction", error: error.message }, { status: 500 });
  }
}
