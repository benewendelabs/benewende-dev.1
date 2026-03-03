import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Admin routes - require admin role
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/auth/login?callbackUrl=/admin", req.url));
      }
    }

    // Dashboard - require authentication
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/login?callbackUrl=/dashboard", req.url));
      }
    }

    // CV Generator - require authentication
    if (pathname.startsWith("/cv-generator")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/login?callbackUrl=/cv-generator", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        // These routes are matched by the config.matcher below
        // Allow access if token exists, or redirect to login
        if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard") || pathname.startsWith("/cv-generator")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/cv-generator/:path*", "/dashboard/:path*"],
};
