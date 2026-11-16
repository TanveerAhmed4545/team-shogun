import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import User from "@/models/User";
import { ApiResponse } from "@/lib/utils/api-response";
import { checkRateLimit } from "@/lib/utils/rate-limit";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting: max 30 searches per minute per user
    const isAllowed = checkRateLimit(`search_${session.user.id}`, 30, 60000);
    if (!isAllowed) {
      return ApiResponse.error("Too many search requests. Please slow down.", 429);
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return ApiResponse.success({ projects: [], users: [], navigation: [] });
    }

    await dbConnect();

    // Escape regex special characters to prevent ReDoS / injection
    const escapedQuery = query.trim().slice(0, 50).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedQuery, "i");

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
