// app/api/faculty/register/route.js
import { connectDB } from "@/db/db.js";
import Faculty from "@/models/facultyModel.js";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs"

// Ensure database connection
await connectDB()

export async function POST(request) {
    try {
        // Parse the request body
        const body = await request.json()
        console.log("Received faculty registration request:", body);

        const {
            name, 
            university_email, 
            id, 
            password, 
            department, 
            research_interests
        } = body

        // Validate required fields
        if (!name || !university_email || !id || !password || !department) {
            return NextResponse.json({
                error: "All fields except research interests are required",
                success: false
            }, {status: 400})
        }

        // Validate email domain
        if (!university_email.endsWith("@bracu.ac.bd")) {
            return NextResponse.json({
                error: "Please use a valid BRACU faculty email",
                success: false
            }, {status: 400})
        }

        // Check if faculty already exists
        let existingFaculty = await Faculty.findOne({
            $or: [
                { university_email },
                { id }
            ]
        })

        if (existingFaculty) {
            return NextResponse.json({
                error: "Faculty with this email or ID already exists",
                success: false
            }, {status: 400})
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        // Prepare research interests
        const processedResearchInterests = research_interests 
            ? research_interests.split(',').map(interest => interest.trim())
            : []

        // Create new faculty
        const newFaculty = new Faculty({
            name, 
            university_email,
            id, 
            password: hashedPassword,
            department,
            research_interests: processedResearchInterests,
            role: 'faculty',
            
        })

        // Save faculty
        const savedFaculty = await newFaculty.save()

        console.log("Faculty registered successfully:", savedFaculty);

        return NextResponse.json({
            success: true,
            message: "Faculty registered successfully!",
            user: savedFaculty
        }, {status: 201})

    } catch (error) {
        console.error("Faculty Registration Error:", error);
        return NextResponse.json({
            error: error.message || "An unexpected error occurred during faculty registration",
            success: false
        }, {status: 500})
    }
}



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
                
                // Additional optional fields from the faculty model
                work_experience: faculty.work_experience || [],
                phone_number: faculty.phone_number,
                office_location: faculty.office_location,
                publications: faculty.publications || [],
                education: faculty.education || [],
                linkedin_profile: faculty.linkedin_profile,
                biography: faculty.biography
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