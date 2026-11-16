import { authService } from "@/lib/services/auth.service";
import { registerSchema } from "@/lib/validations/auth.schema";
import { ApiResponse } from "@/lib/utils/api-response";
import { checkRateLimit } from "@/lib/utils/rate-limit";

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
    const isAllowed = checkRateLimit(`register_${ip}`, 5, 60000);
    if (!isAllowed) {
      return ApiResponse.error("Too many registration attempts. Please try again later.", 429);
    }

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
