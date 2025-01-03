// app/users/signup/faculty/page.js
"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function FacultySignup() {
    const router = useRouter();
    const [user, setUser] = useState({
        name: "",
        university_email: "",
        id: "",
        password: "",
        confirm_password: "",
        department: "",
        research_interests: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false
    });

    const validatePassword = (password) => {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        setPasswordStrength(checks);
        return Object.values(checks).every(check => check);
    };

    const signupButtonHandler = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Comprehensive Validation
        const validationErrors = [];

        // Name validation
        if (!user.name || user.name.length < 2) {
            validationErrors.push("Name must be at least 2 characters long");
        }

        // Email validation
        if (!user.university_email || !user.university_email.endsWith("@bracu.ac.bd")) {
            validationErrors.push("Please use a valid BRACU faculty email address");
        }

        // ID validation
        if (!user.id || !/^\d{8}$/.test(user.id)) {
            validationErrors.push("Faculty ID must be 8 digits");
        }

        // Department validation
        if (!user.department) {
            validationErrors.push("Department is required");
        }

        // Password validation
        if (!validatePassword(user.password)) {
            validationErrors.push("Password does not meet strength requirements");
        }

        // Password match validation
        if (user.password !== user.confirm_password) {
            validationErrors.push("Passwords do not match");
        }

        // Check for validation errors
        if (validationErrors.length > 0) {
            setError(validationErrors.join(", "));
            return;
        }

        try {
            console.log("Sending registration request with data:", {
                name: user.name,
                university_email: user.university_email,
                id: user.id,
                department: user.department,
                research_interests: user.research_interests
            });

            const response = await axios.post("/api/faculty/register", {
                name: user.name,
                university_email: user.university_email,
                id: user.id,
                password: user.password,
                department: user.department,
                research_interests: user.research_interests
            }, {
                // Add config to handle errors more explicitly
                validateStatus: function (status) {
                    return status >= 200 && status < 500; // Reject only if status is 500 or above
                }
            });

            console.log("Registration response:", response);

            if (response.data.success) {
                setSuccess("Registration successful! Redirecting to login...");
                setTimeout(() => {
                    router.push("/users/login");
                }, 2000);
            } else {
                // Log the full error response
                console.error("Registration failed:", response.data);
                setError(response.data.error || "Registration failed");
            }
        } catch (error) {
            // More detailed error logging
            console.error("Signup Error Details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });

            setError(
                error.response?.data?.error || 
                error.message || 
                "An unexpected error occurred during registration"
            );
        }
    };

    

    return (
        <>
            <NavBar />
            <div style={styles.container}>
                <form style={styles.form} onSubmit={signupButtonHandler}>
                    <h2 style={styles.heading}>Faculty Registration</h2>
                    
                    {error && <div style={styles.errorBox}>{error}</div>}
                    {success && <div style={styles.successBox}>{success}</div>}
                    
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Full Name"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        required
                    />
                    
                    <input
                        style={styles.input}
                        type="email"
                        placeholder="BRACU Faculty Email (e.g., name@bracu.ac.bd)"
                        value={user.university_email}
                        onChange={(e) => setUser({ ...user, university_email: e.target.value })}
                        required
                    />
                    
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Faculty ID (8 digits)"
                        value={user.id}
                        onChange={(e) => setUser({ ...user, id: e.target.value })}
                        required
                    />
                    
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Department"
                        value={user.department}
                        onChange={(e) => setUser({ ...user, department: e.target.value })}
                        required
                    />
                    
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Research Interests (optional)"
                        value={user.research_interests}
                        onChange={(e) => setUser({ ...user, research_interests: e.target.value })}
                    />
                    
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={(e) => {
                            setUser({ ...user, password: e.target.value });
                            validatePassword(e.target.value);
                        }}
                        required
                    />
                    
                    <div style={styles.passwordStrength}>
                        <p>Password Requirements:</p>
                        <ul>
                            <li style={{color: passwordStrength.length ? 'green' : 'red'}}>
                                At least 8 characters
                            </li>
                            <li style={{color: passwordStrength.uppercase ? 'green' : 'red'}}>
                                One uppercase letter
                            </li>
                            <li style={{color: passwordStrength.lowercase ? 'green' : 'red'}}>
                                One lowercase letter
                            </li>
                            <li style={{color: passwordStrength.number ? 'green' : 'red'}}>
                                One number
                            </li>
                            <li style={{color: passwordStrength.specialChar ? 'green' : 'red'}}>
                                One special character
                            </li>
                        </ul>
                    </div>
                    
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Confirm Password"
                        value={user.confirm_password}
                        onChange={(e) => setUser({ ...user, confirm_password: e.target.value })}
                        required
                    />
                    
                    <button style={styles.button} type="submit">
                        Register as Faculty
                    </button>
                    
                    <p style={styles.loginLink}>
                        Already have an account? 
                        <span 
                            style={styles.loginLinkText} 
                            onClick={() => router.push("/users/login")}
                        >
                            Login
                        </span>
                    </p>
                </form>
            </div>
        </>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        padding: "20px",
    },
    form: {
        background: "#ffffff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        width: "400px",
    },
    heading: {
        textAlign: "center",
        marginBottom: "20px",
        color:"black"
        
    },
    input: {
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        border: "1px solid #ccc",
        borderRadius: "5px",
        color:"black"
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#6a11cb",
        color: "#ffffff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    errorBox: {
        color: "red",
        marginBottom: "10px",
    },
    successBox: {
        color: "green",
        marginBottom: "10px",
    },
    passwordStrength: {
        margin: "10px 0",
        color:"black"
    },
    loginLink: {
        textAlign: "center",
        marginTop: "10px",
        color: "black"
    },
    loginLinkText: {
        color: "black",
        cursor: "pointer",
        textDecoration: "underline",
    },
};