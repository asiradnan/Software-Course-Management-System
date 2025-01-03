"use client"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"
import NavBar from "@/components/NavBar"

export default function LogIn() {
    const router = useRouter()
    
    const [user, setUser ] = useState({
        university_email: "",
        password: "",
        role: "student", // Default role
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const loginButtonHandler = async (e) => {
        e.preventDefault()
        try {
            console.log("Login Attempt:", {
                email: user.university_email, 
                role: user.role
            });
            
            const response = await axios.post("/api/users/login", user);
            console.log("Login Response:", response.data);
            
            if (response.data.success) {
                // Redirect based on role
                router.push("/users/profile");
            } else {
                // More detailed error handling
                alert(response.data.message || "Login failed");
            }
        
        } catch (error) {
            console.log(error)
            // Optionally add error handling
            alert("Login failed. Please try again.");
        }
    }

    const handleRoleChange = (role) => {
        setUser ({ ...user, role });
        setDropdownOpen(false);
    }

    return (
        <>
            <NavBar />
            <div style={styles.container}>
                <form style={styles.form}>
                    <h2 style={styles.heading}>Log In</h2>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="University Email"
                        value={user.university_email}
                        onChange={(e) => setUser({ ...user, university_email: e.target.value })}
                    />
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                    
                    Role Dropdown
                    <div style={styles.dropdownContainer}>
                        <button 
                            type="button" 
                            style={styles.dropdownButton} 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            Role: {user.role}
                        </button>
                        {dropdownOpen && (
                            <div style={styles.dropdownMenu}>
                                <button 
                                    style={styles.dropdownItem} 
                                    onClick={() => handleRoleChange("student")}
                                >
                                    Student
                                </button>
                                <button 
                                    style={styles.dropdownItem} 
                                    onClick={() => handleRoleChange("faculty")}
                                >
                                    Faculty
                                </button>
                            </div>
                        )}
                    </div>

                    <button style={styles.button} onClick={loginButtonHandler}>
                        Submit
                    </button>
                    <button style={styles.forgotButton}>
                        Forgot Password?
                    </button>
                </form>
            </div>
        </>
    );
}

// ... styles remain the same
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        color: "#fff",
    },
    form: {
        background: "#fff",
        padding: "20px 40px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        width: "300px",
    },
    heading: {
        marginBottom: "20px",
        fontSize: "24px",
        color: "#333",
    },
    input: {
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "16px",
        color: "black",
    },
    button: {
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "10px",
        marginBottom: "10px",
        marginLeft: "10px",
        transition: "transform 0.2s",
    },
    forgotButton: {
        background: "none",
        color: "#6a11cb",
        border: "none",
        padding: "10px 0",
        fontSize: "14px",
        textDecoration: "underline",
        cursor: "pointer",
 marginTop: "10px",
    },
    dropdownContainer: {
        position: "relative",
        margin: "10px 0",
    },
    dropdownButton: {
        width: "100%",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        background: "#fff",
        color: "black",
        fontSize: "16px",
        cursor: "pointer",
    },
    dropdownMenu: {
        position: "absolute",
        top: "100%",
        left: "0",
        right: "0",
        background: "#fff",
        borderRadius: "5px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 1,
    },
    dropdownItem: {
        width: "100%",
        padding: "10px",
        border: "none",
        background: "none",
        textAlign: "left",
        cursor: "pointer",
        fontSize: "16px",
        color:'black'
    },
};

