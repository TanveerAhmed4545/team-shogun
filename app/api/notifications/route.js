import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";

// Removed DEMO_NOTIFICATIONS

export async function GET() {
  try {
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ notifications: [] }, { status: 200 });
    }
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(30);
    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ notifications: [] }, { status: 200 });
  }
}
