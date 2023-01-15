import { NextMiddleware, NextRequest, NextResponse } from 'next/server'

import { redirectingPathnames } from '../../utils/sharedData'

// {"/article/mern-stack-easy-full-stack":"/article/mern-stack"}

export const middleware: NextMiddleware = (req: NextRequest) => {
    const pathname = req.nextUrl.pathname
    if (pathname in redirectingPathnames) {
        const origin = req.nextUrl.origin
        const newPathname = redirectingPathnames[pathname]
        return NextResponse.redirect(origin + newPathname)
    }
    return NextResponse.next()
}
