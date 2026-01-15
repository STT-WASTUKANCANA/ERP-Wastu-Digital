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

        // Fungsi helper untuk cek apakah token expired
        const isTokenExpired = (token: string) => {
            try {
                const decoded: any = jwtDecode(token)
                return decoded.exp * 1000 < Date.now()
            } catch (e) {
                return true
            }
        }

        // Jika tidak ada refresh token, paksa login
        if (!refreshToken) {
            console.log(`[Middleware] No refresh token found. Redirecting to /auth/signin`)
            const response = NextResponse.redirect(new URL('/auth/signin', request.url))
            // Pastikan hapus cookie sisa jika ada
            response.cookies.delete('access_token')
            response.cookies.delete('refresh_token')
            return response
        }

        // Validasi Access Token
        if (!accessToken || isTokenExpired(accessToken)) {
            console.log(`[Middleware] Access token missing or expired. Attempting refresh...`)

            try {
                // Panggil endpoint refresh backend
                const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Cookie': `refresh_token=${refreshToken}`,
                    },
                })

                if (!refreshRes.ok) {
                    throw new Error('Refresh failed')
                }

                const refreshData = await refreshRes.json()
                const newAccessToken = refreshData.access_token

                if (newAccessToken) {
                    console.log(`[Middleware] Token refreshed successfully.`)

                    // Teruskan request dengan token baru di header
                    // Supaya Server Component langsung dapat token baru ini
                    const requestHeaders = new Headers(request.headers)
                    requestHeaders.set('Authorization', `Bearer ${newAccessToken}`)

                    const response = NextResponse.next({
                        request: {
                            headers: requestHeaders,
                        },
                    })

                    // Simpan token baru ke cookie browser (Solusi Permanen)
                    response.cookies.set('access_token', newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: refreshData.expires_in
                    })

                    return response
                }
            } catch (error) {
                console.error(`[Middleware] Token refresh failed:`, error)
                // Jika refresh gagal, redirect ke login
                const response = NextResponse.redirect(new URL('/auth/signin', request.url))
                response.cookies.delete('access_token')
                response.cookies.delete('refresh_token')
                return response
            }
        }
    }

    // 2. GUEST ROUTES: Auth (Signin/Signup)
    if (pathname.startsWith('/auth')) {
        const refreshToken = request.cookies.get('refresh_token')?.value

        // Sederhana: jika punya refresh token, anggap logged in
        if (refreshToken) {
            console.log(`[Middleware] Authenticated user accessing ${pathname}. Redirecting to /workspace`)
            return NextResponse.redirect(new URL('/workspace/overview', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/workspace/:path*', '/auth/:path*'],
}
