import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 1. PROTECTED ROUTES: Workspace
    // Check if user is accessing workspace routes
    if (pathname.startsWith('/workspace')) {
        // We check for refresh_token because access_token might be expired
        // but the session is still valid if refresh_token exists
        const hasRefreshToken = request.cookies.has('refresh_token')

        if (!hasRefreshToken) {
            // Redirect to signin if no token found
            console.log(`[Middleware] Unauthorized access to ${pathname}. Redirecting to /auth/signin`);
            return NextResponse.redirect(new URL('/auth/signin', request.url));
        }
    }

    // 2. GUEST ROUTES: Auth (Signin/Signup)
    // Avoid double login. If user already has a session, kick them to workspace
    if (pathname.startsWith('/auth')) {
        const hasRefreshToken = request.cookies.has('refresh_token')

        if (hasRefreshToken) {
            console.log(`[Middleware] Authenticated user accessing ${pathname}. Redirecting to /workspace`);
            return NextResponse.redirect(new URL('/workspace/overview', request.url));
        }
    }

    // Allow request to proceed
    return NextResponse.next()
}

export const config = {
    // Match workspace routes AND auth routes
    matcher: ['/workspace/:path*', '/auth/:path*'],
}
