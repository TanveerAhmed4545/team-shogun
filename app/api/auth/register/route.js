import { authService } from "@/lib/services/auth.service";
import { registerSchema } from "@/lib/validations/auth.schema";
import { ApiResponse } from "@/lib/utils/api-response";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // 1. Validate Input
    const validatedData = registerSchema.safeParse(body);
    if (!validatedData.success) {
      return ApiResponse.badRequest("Validation failed", validatedData.error.format());
    }

    // 2. Register User
    const user = await authService.registerUser(validatedData.data);

    return ApiResponse.success(
      { userId: user._id }, 
      "Registration successful. Please wait for admin approval.", 
      201
    );
  } catch (error) {
    console.error("❌ Registration Error:", error);
    if (error.message.includes("exists")) {
      return ApiResponse.badRequest(error.message);
    }
    return ApiResponse.error("An error occurred during registration.");
  }
}
