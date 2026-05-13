import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Activity from "@/models/Activity";

// Removed DEMO_ACTIVITIES

export async function GET(req) {
  try {
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ activities: [] }, { status: 200 });
    }
    const activities = await Activity.find({}).sort({ createdAt: -1 }).limit(10);
    return NextResponse.json({ activities }, { status: 200 });
  } catch (error) {
    console.error("Activities GET Error:", error);
    return NextResponse.json({ activities: [] }, { status: 200 });
  }
}
