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

    // Always fetch notifications meant specifically for this user
    const query = { userId: session.user.id };

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(30);
    return ApiResponse.success({ notifications });
  } catch (error) {
    return ApiResponse.success({ notifications: [] }, "Could not fetch notifications");
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const db = await dbConnect();
    if (!db) return NextResponse.json({ message: "DB Connection failed" }, { status: 500 });

    const { id, markAll } = await req.json();

    if (markAll) {
      // Mark all as read for this user
      await Notification.updateMany({ userId: session.user.id, read: false }, { read: true });
    } else if (id) {
      // Mark specific notification as read
      await Notification.findOneAndUpdate({ _id: id, userId: session.user.id }, { read: true });
    }

    return ApiResponse.success({ message: "Updated" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update notification" }, { status: 500 });
  }
}
