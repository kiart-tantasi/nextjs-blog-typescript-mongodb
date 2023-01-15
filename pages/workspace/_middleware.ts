import { NextMiddleware, NextRequest, NextResponse } from 'next/server'

import { tokenValidation } from '../../lib/jwt-token-validation'

export const middleware: NextMiddleware = (req: NextRequest) => {
    if (req.nextUrl.pathname === '/workspace') return NextResponse.next()
    const token = req.cookies.token
    let result = tokenValidation(token)
    if (result === true) return NextResponse.next()
    else {
        const origin = req.nextUrl.origin
        return NextResponse.redirect(origin + '/workspace')
    }
}
