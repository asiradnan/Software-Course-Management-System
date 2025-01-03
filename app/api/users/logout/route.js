// import { NextResponse } from "next/server";

// export async function GET(){
//     try {
//         const response = NextResponse.json({message:"Logged Out Successfully"},{status:200})
//         response.cookies.set("token","",{httpOnly:true, expires: new Date(0)})
//         return response
//     } catch (error) {
//         NextResponse.json({error:error},{status:500})
//     }
    
// }

// app/api/users/logout/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // Create a response to clear the token cookie
        const response = NextResponse.json({
            message: "Logged out successfully",
            success: true
        });

        // Clear the token cookie
        response.cookies.set("token", "", { 
            httpOnly: true, 
            expires: new Date(0) 
        });

        return response;
    } catch (error) {
        return NextResponse.json({
            error: "Error during logout",
            success: false
        }, { status: 500 });
    }
}

// import { NextResponse } from "next/server";

// export async function GET() {
//     try {
//         // Create a response to clear the token cookie
//         const response = NextResponse.json({
//             message: "Logout successful",
//             success: true
//         });

//         // Clear the token cookie
//         response.cookies.set("token", "", {
//             httpOnly: true,
//             expires: new Date(0)
//         });

//         return response;
//     } catch (error) {
//         return NextResponse.json({
//             error: error.message,
//             success: false
//         }, { status: 500 });
//     }
// }