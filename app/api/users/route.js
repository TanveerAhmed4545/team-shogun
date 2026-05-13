import { userService } from "@/lib/services/user.service";
import { ApiResponse } from "@/lib/utils/api-response";

export async function GET(req) {
  try {
    const users = await userService.getAllUsers();
    return ApiResponse.success({ users }); // Nested in {users} for UI compatibility
  } catch (error) {
    console.error("Users GET Error:", error);
    return ApiResponse.success({ users: [] }, "Could not fetch users");
  }
}
