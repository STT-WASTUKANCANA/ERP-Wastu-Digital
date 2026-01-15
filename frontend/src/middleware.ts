import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 1. PROTECTED ROUTES: Workspace
    if (pathname.startsWith('/workspace')) {
        const accessToken = request.cookies.get('access_token')?.value
        const refreshToken = request.cookies.get('refresh_token')?.value

        const redirectToLogin = () => {
            const response = NextResponse.redirect(new URL('/auth/signin', request.url))
            response.cookies.delete('access_token')
            response.cookies.delete('refresh_token')
            return response
        }

        const isTokenExpired = (token: string) => {
            try {
                const decoded: any = jwtDecode(token)
                return decoded.exp * 1000 < Date.now()
            } catch (e) {
                return true
            }
        }

        if (!refreshToken) {
            return redirectToLogin()
        }

        let validToken = accessToken
        let needsCookieUpdate = false
        let newAccessToken = ''
        let newExpiresIn = 0

        // Refresh token logic
        if (!accessToken || isTokenExpired(accessToken)) {
            try {
                const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': `refresh_token=${refreshToken}`,
                    },
                })

                if (!refreshRes.ok) throw new Error('Refresh failed')

                const refreshData = await refreshRes.json()
                validToken = refreshData.access_token
                newAccessToken = refreshData.access_token
                newExpiresIn = refreshData.expires_in
                needsCookieUpdate = true
            } catch (error) {
                return redirectToLogin()
            }
        }

        // Role-Based Access Control
        if (validToken) {
            try {
                const decoded: any = jwtDecode(validToken)
                const roleId = Number(decoded.role_id)
                const isAdminRoute = pathname.startsWith('/workspace/manage') || pathname.startsWith('/workspace/master')

                if (isAdminRoute && roleId !== 5) {
                    // Unauthorized: Rewrite to /unauthorized to let client handle "Back"
                    const response = NextResponse.rewrite(new URL('/unauthorized', request.url))

                    if (needsCookieUpdate) {
                        response.cookies.set('access_token', newAccessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: newExpiresIn
                        })
                    }
                    return response
                }
            } catch (e) {
                return redirectToLogin()
            }
        }

        // Pass valid token to headers
        const requestHeaders = new Headers(request.headers)
        if (validToken) {
            requestHeaders.set('Authorization', `Bearer ${validToken}`)
        }

        const response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })

        // Set cookie if refreshed
        if (needsCookieUpdate) {
            response.cookies.set('access_token', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: newExpiresIn
            })
        }

        return response
    }

    // 2. GUEST ROUTES: Auth (Signin/Signup)
    if (pathname.startsWith('/auth')) {
        const refreshToken = request.cookies.get('refresh_token')?.value

        // Provide seamless Back navigation for logged-in users visiting auth pages
        if (refreshToken) {
            return NextResponse.rewrite(new URL('/unauthorized', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/workspace/:path*', '/auth/:path*'],
}
