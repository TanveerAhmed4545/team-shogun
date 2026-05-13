import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Activity from "@/models/Activity";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const project = await Project.findById(id).populate("developer.id", "name avatar");

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const data = await req.json();

    const project = await Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    if (data.orderStatus) {
      await Activity.create({
        userId: session.user.id,
        userName: session.user.name || "User",
        action: `changed status to ${data.orderStatus}`,
        target: project.orderId,
        projectId: project._id,
        type: "status"
      });
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update project", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    // Only Admin can delete projects based on Phase 3
    if (!session || session.user.status !== "active" || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized or Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
