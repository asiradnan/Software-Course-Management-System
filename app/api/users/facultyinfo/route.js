import { NextResponse } from "next/server";
import Faculty from "@/models/facultyModel.js";
import { getIdFromToken } from "@/helpers/getIdFromToken.js";
import { connectDB } from "@/db/db";

connectDB();

export async function GET(request) {
    try {
        // Get user ID from token
        const userId = await getIdFromToken(request);
        
        // Check if user is authenticated
        if (!userId) {
            return NextResponse.json({
                message: "User not authenticated", 
                success: false
            }, { status: 401 });
        }

        // Find faculty by ID and exclude sensitive information
        const faculty = await Faculty.findById(userId).select('-password');
        
        // Check if faculty exists
        if (!faculty) {
            return NextResponse.json({
                message: "Faculty not found", 
                success: false
            }, { status: 404 });
        }

        // Check if the user is actually a faculty
        if (faculty.role !== 'faculty') {
            return NextResponse.json({
                message: "Access denied", 
                success: false
            }, { status: 403 });
        }

        // Prepare response with faculty information
        return NextResponse.json({
            success: true,
            faculty: {
                name: faculty.name,
                university_email: faculty.university_email,
                id: faculty.id,
                role: faculty.role,
                department: faculty.department,
                research_interests: faculty.research_interests,
                work_experience: faculty.work_experience,
                phone_number: faculty.phone_number,
                office_location: faculty.office_location,         
                publications: faculty.publications,
                education: faculty.education,
                linkedin_profile: faculty.linkedin_profile,
                
                
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Faculty Info Retrieval Error:", error);
        return NextResponse.json({
            success: false, 
            error: "Error retrieving faculty information",
            details: error.message
        }, { status: 500 });
    }
}