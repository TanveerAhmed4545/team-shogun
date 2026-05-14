import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";
import { ApiResponse } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return NextResponse.json({ notifications: [] }, { status: 401 });
    }

    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ notifications: [] }, { status: 200 });
    }

    let query = {};
    if (session.user.role !== "admin") {
      query = { userId: session.user.id };
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(30);
    return ApiResponse.success({ notifications });
  } catch (error) {
    return ApiResponse.success({ notifications: [] }, "Could not fetch notifications");
  }
}
