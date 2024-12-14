import { connectDB } from "@/db/db.js";
import User from "@/models/userModel.js";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs"

await connectDB()

export async function POST(request) {
    try {
        const body = await request.json()
        const {name, university_email, id, password, arole} = body
        var user = await User.findOne({university_email})
        if (user) {
            return NextResponse.json({error:"The email is already registred"},{status:400})
        }
        user = await User.findOne({id})
        if (user) {
            return NextResponse.json({error:"The ID is already registred"},{status:400})
        }
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password,salt)
        const newUser = new User({name, university_email,id, password: hashedPassword, role: arole})
        const savedUser = await newUser.save()
        return NextResponse.json({success:true,message:"User created successfully!",user:savedUser},{status:201})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error:error},{status:500})
    }
}

// import { connectDB } from "@/db/db.js";
// import User from "@/models/userModel.js";
// import { NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";

// await connectDB();

// export async function POST(request) {
//     try {
//         const body = await request.json();
//         const { name, university_email, id, password } = body;

//         // Determine role based on email
//         const role = university_email.includes('@g.bracu.ac.bd') 
//             ? 'student' 
//             : university_email.includes('@bracu.ac.bd') 
//             ? 'faculty' 
//             : null;

//         if (!role) {
//             return NextResponse.json({
//                 error: "Invalid university email",
//                 success: false
//             }, { status: 400 });
//         }

//         // Check if user already exists
//         let existingUser = await User.findOne({ 
//             $or: [{ university_email }, { id }] 
//         });

//         if (existingUser) {
//             return NextResponse.json({
//                 error: "User already exists",
//                 success: false
//             }, { status: 400 });
//         }

//         // Hash password
//         const salt = await bcryptjs.genSalt(10);
//         const hashedPassword = await bcryptjs.hash(password, salt);

//         // Create new user
//         const newUser = new User({
//             name, 
//             university_email,
//             id, 
//             password: hashedPassword,
//             role: role
//         });

//         const savedUser = await newUser.save();

//         return NextResponse.json({
//             success: true,
//             message: "User created successfully!",
//             user: savedUser
//         }, { status: 201 });

//     } catch (error) {
//         console.error("Signup Error:", error);
//         return NextResponse.json({
//             success: false,
//             error: error.message
//         }, { status: 500 });
//     }
// }