import { NextResponse } from "next/server";

/**
 * Standardized API Response utility
 */
export class ApiResponse {
  static success(data, message = "Success", status = 200) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status }
    );
  }

  static error(message = "Internal Server Error", status = 500, errors = null) {
    return NextResponse.json(
      {
        success: false,
        message,
        ...(errors && { errors }),
      },
      { status }
    );
  }

  static unauthorized(message = "Unauthorized") {
    return this.error(message, 401);
  }

  static forbidden(message = "Forbidden") {
    return this.error(message, 403);
  }

  static notFound(message = "Resource not found") {
    return this.error(message, 404);
  }

  static badRequest(message = "Bad Request", errors = null) {
    return this.error(message, 400, errors);
  }
}
