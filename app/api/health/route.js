import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    const conn = await dbConnect();
    if (conn) {
      return NextResponse.json({ status: "connected", message: "Database is online" }, { status: 200 });
    } else {
      return NextResponse.json({ status: "error", message: "Database connection failed" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
