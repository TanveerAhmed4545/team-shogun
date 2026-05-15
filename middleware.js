import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (token && token.status !== "active") {
      if (path !== "/pending") {
        return NextResponse.redirect(new URL("/pending", req.url));
      }
    }

    // Protect Admin routes
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);

export const config = {
  matcher: [
    "/",
    "/projects/:path*",
    "/leaderboard/:path*",
    "/team/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/notifications/:path*",
    "/admin/:path*",
  ],
};
