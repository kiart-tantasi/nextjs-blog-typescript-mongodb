import { type NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './lib/auth-edge'

export const config = {
    runtime: 'edge',
    matcher: ['/workspace/:path*']
}

// ref: https://github.com/vercel/examples/blob/main/edge-middleware/jwt-authentication/middleware.ts
export async function middleware(request: NextRequest) {
    const isHomePage: boolean = request.nextUrl.pathname === '/workspace'
    if (isHomePage) {
        return NextResponse.next()
    }

    const token = request.cookies.get('token')
    const isVerified: boolean = await verifyToken(token)
    if (isVerified) {
        return NextResponse.next()
    }
    return NextResponse.redirect(request.nextUrl.origin + '/workspace')
}
