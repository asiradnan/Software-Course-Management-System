// // // // // // // // // import { connectDB } from "@/db/db";
// // // // // // // // // import { getIdFromToken } from "@/helpers/getIdFromToken.js";
// // // // // // // // // import User from "@/models/userModel.js";
// // // // // // // // // import { NextResponse } from "next/server";

// // // // // // // // // connectDB()

// // // // // // // // // export async function GET(request) {
// // // // // // // // //     try {
// // // // // // // // //         const userId = await getIdFromToken(request)
// // // // // // // // //         if (userId == null) {
// // // // // // // // //             return NextResponse.json({"logged_in":false},{status:200})
// // // // // // // // //         }
// // // // // // // // //         const user = await User.findById(userId)
// // // // // // // // //         return NextResponse.json({"logged_in":true,"user":user},{status:200})
// // // // // // // // //     } catch (error) {
// // // // // // // // //         console.log(error.message)
// // // // // // // // //         return NextResponse.json({error:error.message},{status:500})
// // // // // // // // //     }
// // // // // // // // // }

// app/api/users/userinfo/route.js
import { connectDB } from "@/db/db";
import { getIdFromToken } from "@/helpers/getIdFromToken.js";
import User from "@/models/userModel.js";
import Faculty from "@/models/facultyModel.js"; // Import Faculty model
import { NextResponse } from "next/server";

connectDB();

export async function GET(request) {
    try {
        const userId = await getIdFromToken(request);
        if (userId == null) {
            return NextResponse.json({ "logged_in": false }, { status: 200 });
        }
        
        const user = await User.findById(userId);
        if (user) {
            return NextResponse.json({ "logged_in": true, "user": user }, { status: 200 });
        }

        const faculty = await Faculty.findById(userId);
        if (faculty) {
            return NextResponse.json({ "logged_in": true, "user": faculty }, { status: 200 });
        }

        return NextResponse.json({ "logged_in": false }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user info:", error);
        return NextResponse.json({ "logged_in": false }, { status: 500 });
    }
}

// PUT method to update user profile information
export async function PUT(request) {
    try {
        const userId = await getIdFromToken(request);
        if (userId == null) {
            return NextResponse.json({ "logged_in": false }, { status: 200 });
        }

        const body = await request.json();
        const { name, university_email, id, department, research_interests } = body;

        // Update user data
        const user = await User.findByIdAndUpdate(userId, { name, university_email, id }, { new: true });
        if (user) {
            return NextResponse.json({ success: true, user }, { status: 200 });
        }

        // Update faculty data
        const faculty = await Faculty.findByIdAndUpdate(userId, { name, university_email, id, department, research_interests }, { new: true });
        if (faculty) {
            return NextResponse.json({ success: true, user: faculty }, { status: 200 });
        }

        return NextResponse.json({ success: false }, { status: 404 });
    } catch (error) {
        console.error("Error updating profile info:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
