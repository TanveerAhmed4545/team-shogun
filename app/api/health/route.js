import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/User";

export async function GET() {
  try {
    const conn = await dbConnect();
    const session = await getServerSession(authOptions);
    let requiresLogout = false;

    if (conn && session?.user?.id) {
      const user = await User.findById(session.user.id).select("requiresLogout");
      if (user?.requiresLogout) {
        requiresLogout = true;
        await User.findByIdAndUpdate(session.user.id, { requiresLogout: false });
      }
    }

    if (conn) {
      return NextResponse.json({ 
        status: "connected", 
        message: "Database is online",
        requiresLogout 
      }, { status: 200 });
    } else {
      return NextResponse.json({ status: "error", message: "Database connection failed" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
