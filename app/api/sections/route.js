//GET -all sections
//POST -create section
import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import Section from "@/models/sectionModel";
import User from "@/models/userModel";
import { getIdFromToken } from "@/helpers/getIdFromToken";

export async function GET(request) {
    try {
        await connectDB();
        
        // Get faculty ID from token
        const facultyId = await getIdFromToken(request);
        
        if (!facultyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find sections for the specific faculty
        const sections = await Section.find({ faculty: facultyId });
        
        return NextResponse.json({ sections }, { status: 200 });
    } catch (error) {
        console.error("Error fetching sections:", error);
        return NextResponse.json({ 
            error: "Internal Server Error", 
            details: error.message 
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        
        // Get user ID from token
        const userId = await getIdFromToken(request);
        const user = await User.findById(userId);   
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse request body
        const reqBody = await request.json();
        
        // Validate input
        if (!reqBody.course || !reqBody.semester || reqBody.section_number == null) {
            return NextResponse.json({ error: "Course, semester, and section number are required" }, { status: 400 });
        }

        // Check if section_number is already in use
        const existingSection = await Section.findOne({ section_number: reqBody.section_number, course: reqBody.course, semester: reqBody.semester });
        if (existingSection) {
            return NextResponse.json({ error: "Section number already exists" }, { status: 400 });
        }
        if (user.role !== "faculty") {
            return NextResponse.json({ error: "Only faculty can create sections" }, { status: 403 });
        }

        // Create new section
        console.log(user)
        const newSection = new Section({
            course: reqBody.course,
            semester: reqBody.semester,
            faculty: user._id, // Assuming the student is creating a section under their ID
            students: [],
            section_number: reqBody.section_number // Ensure this is provided
        });
        console.log(newSection)

        // Save section
        const savedSection = await newSection.save();
        
        return NextResponse.json({ section: savedSection }, { status: 201 });
    } catch (error) {
        console.error("Error creating section:", error);
        return NextResponse.json({ 
            error: "Internal Server Error", 
            details: error.message 
        }, { status: 500 });
    }
}