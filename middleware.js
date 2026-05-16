import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    let res = NextResponse.next();

    if (token && token.status !== "active") {
      if (path !== "/pending") {
        res = NextResponse.redirect(new URL("/pending", req.url));
      }
    }

    // Protect Admin routes
    if (path.startsWith("/admin") && token?.role !== "admin") {
      res = NextResponse.redirect(new URL("/", req.url));
    }

    // Inject Security Headers
    res.headers.set("X-DNS-Prefetch-Control", "on");
    res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    res.headers.set("X-XSS-Protection", "1; mode=block");
    res.headers.set("X-Frame-Options", "SAMEORIGIN");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    return res;
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
