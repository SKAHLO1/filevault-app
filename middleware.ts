import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Add additional middleware logic here if needed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect dashboard and API routes
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith("/api/") && !req.nextUrl.pathname.startsWith("/api/auth")) {
          return !!token
        }
        return true
      },
    },
  },
)

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/encryption/:path*", "/recovery/:path*"],
}
