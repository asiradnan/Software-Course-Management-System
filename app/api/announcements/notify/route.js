import Announcement from "@/models/announcementModel.js";
import Section from "@/models/sectionModel";
import { connectDB } from "@/db/db";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';

connectDB()

export async function POST(request) {
    try {
        const body = await request.json();
        const { content, sections } = body;

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        // For each section, get all students and send emails
        for (const sectionId of sections) {
            const section = await Section.findById(sectionId).populate({
                path: 'students',
                select: 'university_email'
            });

            if (section && section.students.length > 0) {
                const studentEmails = section.students.map(student => student.university_email);
                
                // Send email to all students in the section
                await transporter.sendMail({
                    to: studentEmails,
                    subject: 'New Course Announcement',
                    html: `
                        <h2>New Announcement</h2>
                        <p>${content}</p>
                        <p>Course: ${section.course}</p>
                        <p>Section: ${section.section_number}</p>
                    `,
                });
            }
        }

        // Save announcement to database
        const announcement = new Announcement({
            content,
            sections
        });
        await announcement.save();

        return NextResponse.json({ 
            message: "Announcement sent successfully" 
        }, { status: 200 });

    } catch (error) {
        console.error("Error sending announcement:", error);
        return NextResponse.json({ 
            error: "Failed to send announcement" 
        }, { status: 500 });
    }
}
