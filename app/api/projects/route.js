import { projectService } from "@/lib/services/project.service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { z } from "zod";

const projectSchema = z.object({
  clientName: z.string().min(2, "Client name is required").max(100),
  profileName: z.string().min(2, "Profile name is required").max(100),
  orderId: z.string().min(3, "Order ID is required").max(50),
  value: z.number().min(0, "Value cannot be negative"),
  orderStatus: z.enum(["Pending", "WIP", "Revision", "Delivered", "Completed", "Cancelled"]).optional(),
  deadline: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid deadline date"),
  developer: z.object({
    id: z.string().optional(),
    name: z.string().optional()
  }).optional(),
}).passthrough();

import { checkRateLimit } from "@/lib/utils/rate-limit";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const developerId = searchParams.get("developer");
    let filter = {};
    
    if (developerId) {
      const user = await User.findById(developerId);
      filter = user ? { $or: [{ "developer.id": developerId }, { "developer.name": user.name }] } : { "developer.id": developerId };
    }
    
    const projects = await projectService.getAllProjects(filter);
    return ApiResponse.success(projects);
  } catch (error) {
    console.error("Projects GET Error:", error);
    return ApiResponse.success([], "Could not fetch projects"); // Keeping compatibility with UI expecting array
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return ApiResponse.unauthorized("Authentication required or account inactive");
    }

    // Rate limiting (max 10 requests per minute per user)
    const isAllowed = checkRateLimit(`project_create_${session.user.id}`, 10, 60000);
    if (!isAllowed) {
      return ApiResponse.error("Too many requests, please try again later.", 429);
    }

    const body = await req.json();
    
    // Validate input payload
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error.errors[0].message, 400);
    }
    
    const data = parsed.data;
    const project = await projectService.createProject(data, session.user);

    return ApiResponse.success(project, "Project created successfully", 201);
  } catch (error) {
    console.error("Projects POST Error:", error);
    return ApiResponse.error("Failed to create project: " + error.message);
  }
}
