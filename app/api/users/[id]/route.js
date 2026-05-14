import { userService } from "@/lib/services/user.service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return ApiResponse.unauthorized();
    }

    const { id } = await params;
    const user = await userService.getUserById(id);
    if (!user) return ApiResponse.notFound("User not found");

    return ApiResponse.success({ user });
  } catch (error) {
    console.error("User GET Error:", error);
    return ApiResponse.error();
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.status !== "active") {
      return ApiResponse.unauthorized();
    }

    const { id } = await params;

    // Real-time Role Verification (instead of just trusting the session JWT)
    const currentUser = await userService.getUserById(session.user.id);
    const isActuallyAdmin = currentUser?.role === "admin";

    if (!isActuallyAdmin && session.user.id !== id) {
      return ApiResponse.forbidden();
    }

    const data = await req.json();
    if (data.password) delete data.password;

    // Security: Only real-time admins can change role or status
    if (!isActuallyAdmin) {
      delete data.role;
      delete data.status;
    }

    const user = await userService.updateUser(id, data);
    if (!user) return ApiResponse.notFound("User not found");

    return ApiResponse.success({ user }, "User updated successfully");
  } catch (error) {
    console.error("User PUT Error:", error);
    return ApiResponse.error("Failed to update user");
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return ApiResponse.unauthorized();

    const currentUser = await userService.getUserById(session.user.id);
    if (session.user.status !== "active" || currentUser?.role !== "admin") {
      return ApiResponse.forbidden();
    }

    const { id } = await params;
    const user = await userService.deleteUser(id);
    if (!user) return ApiResponse.notFound("User not found");

    return ApiResponse.success(null, "User deleted successfully");
  } catch (error) {
    console.error("User DELETE Error:", error);
    return ApiResponse.error();
  }
}
