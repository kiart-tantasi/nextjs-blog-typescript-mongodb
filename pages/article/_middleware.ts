import { NextMiddleware, NextRequest, NextResponse } from "next/server";

export const middleware: NextMiddleware = (req: NextRequest) => {
    const pathname = req.nextUrl.pathname;
    const origin = req.nextUrl.origin;
    if (pathname === "/article/mern-stack-easy-full-stack") return NextResponse.redirect(origin + "/article/mern-stack");
    return NextResponse.next();
}