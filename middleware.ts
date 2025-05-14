import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // If there's no session and the user is trying to access protected routes
    if (!session) {
        if (req.nextUrl.pathname.startsWith('/admin') ||
            req.nextUrl.pathname.startsWith('/search')) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    // If there's a session, check for admin access
    if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        const isAdmin = user?.user_metadata?.is_admin;

        // If trying to access admin routes without admin privileges
        if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
            return NextResponse.redirect(new URL('/search', req.url));
        }

        // If logged in and trying to access login page
        if (req.nextUrl.pathname === '/') {
            if (isAdmin) {
                return NextResponse.redirect(new URL('/admin', req.url));
            } else {
                return NextResponse.redirect(new URL('/search', req.url));
            }
        }
    }

    return res;
}

export const config = {
    matcher: ['/', '/admin/:path*', '/search/:path*'],
};
