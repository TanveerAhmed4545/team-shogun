import { projectService } from "@/lib/services/project.service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    const projects = await projectService.getAllProjects();
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

    const data = await req.json();
    const project = await projectService.createProject(data, session.user);

    return ApiResponse.success(project, "Project created successfully", 201);
  } catch (error) {
    console.error("Projects POST Error:", error);
    return ApiResponse.error("Failed to create project: " + error.message);
  }
}
