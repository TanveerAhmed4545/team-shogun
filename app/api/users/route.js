import { userService } from "@/lib/services/user.service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return ApiResponse.unauthorized("Authentication required");
    }

    const users = await userService.getAllUsers();
    return ApiResponse.success({ users }); // Nested in {users} for UI compatibility
  } catch (error) {
    console.error("Users GET Error:", error);
    return ApiResponse.success({ users: [] }, "Could not fetch users");
  }
}
