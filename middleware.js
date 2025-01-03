
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function middleware(request) {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get("token")?.value || "";

    // Public paths
    const isPublicPath = 
        path === '/users/login' || 
        path === '/users/signup' || 
        path === '/';

    // Protected paths that require authentication
    const protectedPaths = [
        '/users/profile',
        '/dashboard',
        '/groups',
        '/sections'
    ];

     // Check if the path starts with any protected path
    const isProtectedPath = protectedPaths.some(p => path.startsWith(p));

    // If no token and trying to access protected route
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/users/login', request.url));
    }

    // If token exists and trying to access public path
    if (isPublicPath && token) {
        try {
            const decodedToken = verify(token, process.env.SECRET);
            
            // Redirect based on role
            if (decodedToken.role === 'student') {
                return NextResponse.redirect(new URL('/users/profile/student', request.url));
            } else if (decodedToken.role === 'faculty') {
                return NextResponse.redirect(new URL('/users/profile/faculty', request.url));
            }
        } catch (error) {
            // Invalid token
            return NextResponse.redirect(new URL('/users/login', request.url));
        }
    }

    // Role-based route protection
    if (path.startsWith('/users/profile/student')) {
        try {
            const decodedToken = verify(token, process.env.SECRET);
            if (decodedToken.role !== 'student') {
                return NextResponse.redirect(new URL('/users/login', request.url));
            }
        } catch (error) {
            return NextResponse.redirect(new URL('/users/login', request.url));
        }
    }

    if (path.startsWith('/users/profile/faculty')) {
        try {
            const decodedToken = verify(token, process.env.SECRET);
            if (decodedToken.role !== 'faculty') {
                return NextResponse.redirect(new URL('/users/login', request.url));
            }
        } catch (error) {
            return NextResponse.redirect(new URL('/users/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/users/login',
        '/users/signup',
        '/users/profile/:path*',
        '/groups',
        '/dashboard',
        '/sections'
    ]
}