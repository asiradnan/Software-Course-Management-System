
import { NextResponse } from "next/server";
import User from "@/models/userModel.js";
import Faculty from "@/models/facultyModel.js"; // Ensure this is imported
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { connectDB } from "@/db/db";

connectDB();

export async function POST(request) {
    try {
        const body = await request.json();
        const { university_email, password, role } = body;

        let user;
        // Select the appropriate model based on the role
        if (role === 'student') {
            user = await User.findOne({ university_email, role: 'student' });
        } else if (role === 'faculty') {
            user = await Faculty.findOne({ university_email, role: 'faculty' });
        } else {
            return NextResponse.json({
                message: "Invalid role selected", 
                success: false
            }, { status: 400 });
        }

        // If no user found
        if (!user) {
            return NextResponse.json({
                message: "Email is not registered", 
                success: false
            }, { status: 400 });
        }

        // Verify password
        const passMatches = await bcryptjs.compare(password, user.password);
        if (!passMatches) {
            return NextResponse.json({
                error: "Invalid Password", 
                success: false
            }, { status: 400 });
        }

        // Prepare token data
        const tokenData = {
            id: user._id,
            role: user.role
        };

        // Create token
        const token = jwt.sign(tokenData, process.env.SECRET, { expiresIn: "30d" });

        // Prepare response
        const response = NextResponse.json({
            success: true, 
            message: "Logged In successfully!",
            role: user.role
        }, { status: 200 });

        // Set token cookie
        response.cookies.set("token", token, { httpOnly: true });

        return response;
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({
            success: false, 
            error: error.message
        }, { status: 500 });
    }
}
