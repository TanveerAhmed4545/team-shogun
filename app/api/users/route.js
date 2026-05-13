import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// Removed DEMO_USERS

export async function GET(req) {
  try {
    const db = await dbConnect();

    if (!db) {
      return NextResponse.json({ users: [] }, { status: 200 });
    }

    // Do not return passwords
    const users = await User.find({}).select("-password").sort({ performance_score: -1 });
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Users GET Error:", error);
    return NextResponse.json({ users: [] }, { status: 200 });
  }
}
