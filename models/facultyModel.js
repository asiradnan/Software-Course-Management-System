// models/facultyModel.js
import mongoose from "mongoose";
import User from "@/models/userModel.js";

const facultySchema =  new mongoose.Schema({
    //other infos
    //connect with user
    department: {
        type: String,
        required: true
    },
    
    research_interests: [{
        type: String,
        required: true
    }],
    linkedin_profile: {
        type: String,
        required: false
    },

    work_experience: [{
        type: String,
        required: true
    }],
    phone_number: {
        type: String,
        required: false
    },
    office_location: {
        type: String,
        required: false
    },
    publications: [{
        title: String,
        date: Date,
        link: String
    }],
    education: [{
        degree: String,
        institution: String,
        graduation_year: Number
    }],

    
});

const Faculty = User.discriminator("Faculty", facultySchema);

export default Faculty;