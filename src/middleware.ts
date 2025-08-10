import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest){

    const token = request.cookies.get("token")?.value || ""

    if(!token){
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }    

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/upscale',
    ]
}