import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const filter = session.user.role === "admin" ? { _id: id } : { _id: id, userId: session.user.id };
    const notification = await Notification.findOneAndUpdate(
      filter,
      { read: body.read },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ message: "Notification not found or forbidden" }, { status: 404 });
    }

    return NextResponse.json({ notification }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    const filter = session.user.role === "admin" ? { _id: id } : { _id: id, userId: session.user.id };
    const notification = await Notification.findOneAndDelete(filter);

    if (!notification) {
      return NextResponse.json({ message: "Notification not found or forbidden" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
