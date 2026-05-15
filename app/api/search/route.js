import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import User from "@/models/User";
import { ApiResponse } from "@/lib/utils/api-response";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return ApiResponse.success({ projects: [], users: [], navigation: [] });
    }

    await dbConnect();

    const regex = new RegExp(query, "i");

    // Search Projects
    const projects = await Project.find({
      $or: [
        { orderId: regex },
        { clientName: regex },
        { profileName: regex }
      ]
    }).limit(5).select("orderId clientName orderStatus value");

    // Search Users
    const users = await User.find({
      name: regex,
      status: "active"
    }).limit(5).select("name avatar role");

    // Static Navigation results
    const navigation = [
      { title: "Dashboard", link: "/" },
      { title: "Leaderboard", link: "/leaderboard" },
      { title: "Team", link: "/team" },
      { title: "Settings", link: "/settings" },
      { title: "Notifications", link: "/notifications" }
    ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()));

    return ApiResponse.success({ projects, users, navigation });
  } catch (error) {
    console.error("Search error:", error);
    return ApiResponse.error("Failed to perform search");
  }
}
