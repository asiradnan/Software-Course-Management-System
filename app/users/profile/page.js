
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import axios from "axios";

export default function ProfilePage() {
    const [user, setUser ] = useState(null);
    const [facultyInfo, setFacultyInfo] = useState(null);
    

    useEffect(() => {
        const checkUserRole = async () => {

            
            try {
                
                const response = await axios.get("/api/users/userinfo");
                const data = response.data;
                console.log(data);
                if (data.logged_in) {
                    setUser (data.user);
                    // If the user is a faculty, fetch additional faculty-specific info
                    if (data.user.role === "faculty") {
                        const facultyResponse = await axios.get("/api/users/facultyinfo");
                        setFacultyInfo(facultyResponse.data.faculty);
                    }
                } else {
                    router.push("/users/login"); // Redirect if not logged in
                }
            } catch (error) {
                console.log(error);
                router.push("/users/login"); // Redirect on error
            }
        };

        checkUserRole();
    }, );

    return (
        <>
            <NavBar />
            <div style={styles.container}>
                <h1 style={styles.heading}>Welcome {user?.role}</h1>
                {user?.role === "student" ? (
                    <h1 style={styles.heading}>Student Profile</h1>
                ) : (
                    <h1 style={styles.heading}>Faculty Profile</h1>
                )}
                
                <p style={styles.input}>Name: {user?.name}</p>
                <p style={styles.input}>Email: {user?.university_email}</p>
                <p style={styles.input}>ID: {user?.id}</p>

                {user?.role === "faculty" && facultyInfo && (
                    <>
                        <p style={styles.input}>Department: {facultyInfo.department}</p>
                        {/* <p>Research Interests: {facultyInfo.research_interests}</p> */}
                        {/* <p>Phone Number: {facultyInfo.phone_number}</p> */}
                        {/* <p>Office Location: {facultyInfo.office_location}</p> */}
                        {/* <p>Date of Joining: {new Date(facultyInfo.date_of_joining).toLocaleDateString()}</p>
                        <p>Publications: {facultyInfo.publications}</p>
                        <p>Educations: {facultyInfo.education}</p>
                        <p>LinkedIn Profile: <a href={facultyInfo.linkedin_profile} target="_blank" rel="noopener noreferrer">{facultyInfo.linkedin_profile}</a></p> */}
                        <button style={styles.button}>Add Details</button>
                    </>
                )}
                {/* Button to navigate to Dashboard */}
                <a href="/dashboard" style={styles.dashboardButton}>
                    Go to Dashboard
                </a>
            </div>
        </>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent : "center",
        alignItems: "center",
        padding: "20px",
        background:'white',
    },
    heading: {
        fontSize: "24px",
        marginBottom: "20px",
        color:'black',
    },
    input:{
        fontSize: "19px",
        marginBottom:"5px",
        color:'black',
    },
    button: {
        background: "#6a11cb", // Blue background
        color: "#fff", // White text
        border: "none", // Remove default border
        padding: "12px 20px", // Padding for better button size
        borderRadius: "5px", // Rounded corners
        fontSize: "16px", // Slightly larger font
        cursor: "pointer", // Indicate clickable
        marginTop: "10px",
        transition: "background 0.3s", // Smooth transition
    },
    buttonHover: {
        background: "#2575fc", // Slightly darker blue on hover
    },
    dashboardButton: {
        background: "#007bff", // Dashboard button color
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "20px",
        transition: "background 0.3s",
    },
};

