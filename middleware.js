// // import { NextResponse } from 'next/server'
// // import { verifiedToken } from './helpers/verified_token'

// // // This function can be marked `async` if using `await` inside
// // export async function middleware(request) {
// //     const currentPath = request.nextUrl.pathname
// //     // const verified = await verifiedToken(request)
// //     // console.log(verified)
// //     const token = request.cookies.get("token")
// //     if (currentPath === "/users/login" || "/users/signup" ) {
// //         if (token) {
// //             console.log("Verified user trying to access public")
// //             return NextResponse.redirect(new URL('/users/', request.url))
// //         }
// //     }  
// // }
 
// // // See "Matching Paths" below to learn more
// // export const config = {
// //   matcher: [
// //     "/users/login",
// //     "/users/signup",
// //     "/users/profile"
// //   ]
// // }

// // // middleware.js

// // // import { NextResponse } from 'next/server';
// // // import { verifyToken } from './helpers/verifyToken'; // You'll need to create this helper

// // // export async function middleware(request) {
// // //     const path = request.nextUrl.pathname;

// // //     // Define public paths
// // //     const isPublicPath = 
// // //         path === '/users/login' || 
// // //         path === '/users/signup' || 
// // //         path === '/';

// // //     // Get the token from cookies
// // //     const token = request.cookies.get('token')?.value || '';

// // //     // If it's a public path and no token, allow access
// // //     if (isPublicPath && !token) {
// // //         return NextResponse.next();
// // //     }

// // //     // If it's a public path but token exists, redirect to profile
// // //     if (isPublicPath && token) {
// // //         return NextResponse.redirect(new URL('/users/profile', request.url));
// // //     }

// // //     // If it's a protected route and no token, redirect to login
// // //     if (!isPublicPath && !token) {
// // //         return NextResponse.redirect(new URL('/users/login', request.url));
// // //     }

// // //     // Verify token for protected routes
// // //     try {
// // //         const decodedToken = await verifyToken(token);
        
// // //         // Additional role-based route protection can be added here
// // //         if (path.startsWith('/users/profile/student') && decodedToken.role !== 'student') {
// // //             return NextResponse.redirect(new URL('/users/login', request.url));
// // //         }

// // //         if (path.startsWith('/users/profile/faculty') && decodedToken.role !== 'faculty') {
// // //             return NextResponse.redirect(new URL('/users/login', request.url));
// // //         }

// // //         return NextResponse.next();
// // //     } catch (error) {
// // //         // Token verification failed
// // //         return NextResponse.redirect(new URL('/users/login', request.url));
// // //     }
// // // }

// // // // See "Matching Paths" below to learn more
// // // export const config = {
// // //     matcher: [
// // //         '/',
// // //         '/users/login',
// // //         '/users/signup',
// // //         '/users/profile/:path*'
// // //     ]
// // // }

// import { NextResponse } from 'next/server';
// import { verify } from 'jsonwebtoken';
// import { verifiedToken } from './helpers/verified_token'

// export async function middleware(request) {
//     const path = request.nextUrl.pathname;
//     const token = request.cookies.get("token")?.value || "";

//     // Public paths
//     const isPublicPath = 
//         path === '/users/login' || 
//         path === '/users/signup' || 
//         path === '/';

//     // If no token and trying to access protected route
//     if (!isPublicPath && !token) {
//         return NextResponse.redirect(new URL('/users/login', request.url));
//     }

//     // If token exists and trying to access public path
//     if (isPublicPath && token) {
//         try {
//             const decodedToken = verify(token, process.env.SECRET);
            
//             // Redirect based on role
//             if (decodedToken.role === 'student') {
//                 return NextResponse.redirect(new URL('/users/profile/student', request.url));
//             } else if (decodedToken.role === 'faculty') {
//                 return NextResponse.redirect(new URL('/users/profile/faculty', request.url));
//             }
//         } catch (error) {
//             // Invalid token
//             return NextResponse.redirect(new URL('/users/login', request.url));
//         }
//     }

//     // Role-based route protection
//     if (path.startsWith('/users/profile/student')) {
//         try {
//             const decodedToken = verify(token, process.env.SECRET);
//             if (decodedToken.role !== 'student') {
//                 return NextResponse.redirect(new URL('/users/login', request.url));
//             }
//         } catch (error) {
//             return NextResponse.redirect(new URL('/users/login', request.url));
//         }
//     }

//     if (path.startsWith('/users/profile/faculty')) {
//         try {
//             const decodedToken = verify(token, process.env.SECRET);
//             if (decodedToken.role !== 'faculty') {
//                 return NextResponse.redirect(new URL('/users/login', request.url));
//             }
//         } catch (error) {
//             return NextResponse.redirect(new URL('/users/login', request.url));
//         }
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         '/',
//         '/users/login',
//         '/users/signup',
//         '/users/profile/:path*'
//     ]
// }

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
        '/users/profile/:path*'
    ]
}