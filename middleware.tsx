import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {getIronSession} from "iron-session";
import cookiesSettings from "@/utils/cookies";
import {SessionData} from "@/definitions/session";
import {cookies} from "next/headers";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const session = await getIronSession<SessionData>(cookies(), cookiesSettings);

    if (!session.user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|login|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
