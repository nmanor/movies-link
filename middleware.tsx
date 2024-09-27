import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {getIronSession} from "iron-session";
import cookiesSettings from "@/utils/cookies";
import {SessionData} from "@/definitions/session";
import {cookies} from "next/headers";

export async function middleware(request: NextRequest) {
    const session = await getIronSession<SessionData>(cookies(), cookiesSettings);

    if (!session.user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|login|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
