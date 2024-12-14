// // // // // // // "use client";
// // // // // // // import { useEffect, useState } from "react";
// // // // // // // import { useRouter } from "next/navigation";
// // // // // // // import axios from "axios";
// // // // // // // import Link from "next/link";

// // // // // // // export default function NavBar() {
// // // // // // //     const [user, setUser ] = useState(null);
// // // // // // //     const router = useRouter();

// // // // // // //     useEffect(() => {
// // // // // // //         const fetchUserInfo = async () => {
// // // // // // //             try {
// // // // // // //                 const response = await axios.get("/api/users/userinfo");
// // // // // // //                 if (response.data.logged_in) {
// // // // // // //                     setUser (response.data.user);
// // // // // // //                 }
// // // // // // //             } catch (error) {
// // // // // // //                 console.error("Error fetching user info:", error);
// // // // // // //             }
// // // // // // //         };
// // // // // // //         fetchUserInfo();
// // // // // // //     }, []);

// // // // // // //     const handleLogout = async () => {
// // // // // // //         try {
// // // // // // //             await axios.get("/api/users/logout");
// // // // // // //             setUser (null);
// // // // // // //             router.push("/users/login");
// // // // // // //         } catch (error) {
// // // // // // //             console.error("Logout error:", error);
// // // // // // //         }
// // // // // // //     };

// // // // // // //     return (
// // // // // // //         <nav className="bg-black text-white p-4">
// // // // // // //             <div className="container mx-auto flex justify-between items-center">
// // // // // // //                 <Link href="/" className="text-lg font-bold">
// // // // // // //                    Software Course Management System
// // // // // // //                 </Link>
// // // // // // //                 <div className="flex items-center space-x-4">
// // // // // // //                     {user ? (
// // // // // // //                         <div className="flex items-center space-x-4">
// // // // // // //                             <span className="text-white">
// // // // // // //                                  {user.name} ekhane dropdown
// // // // // // //                             </span>
// // // // // // //                             <button 
// // // // // // //                                 onClick={handleLogout} 
// // // // // // //                                 className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition duration-300"
// // // // // // //                             >
// // // // // // //                                 Log Out
// // // // // // //                             </button>
// // // // // // //                         </div>
// // // // // // //                     ) : (
// // // // // // //                         <div className="flex space-x-4">
// // // // // // //                             <Link 
// // // // // // //                                 href="/users/login" 
// // // // // // //                                 className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition duration-300"
// // // // // // //                             >
// // // // // // //                                 Log In
// // // // // // //                             </Link>
// // // // // // //                             <Link 
// // // // // // //                                 href="/users/signup" 
// // // // // // //                                 className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition duration-300"
// // // // // // //                             >
// // // // // // //                                 Sign Up
// // // // // // //                             </Link>
// // // // // // //                         </div>
// // // // // // //                     )}
// // // // // // //                 </div>
// // // // // // //             </div>
// // // // // // //         </nav>
// // // // // // //     );
// // // // // // // }

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function NavBar() {
    const [user, setUser ] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // Reset previous errors
                setError(null);

                const response = await axios.get("/api/users/userinfo", {
                    timeout: 5000,
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                });

                console.log("NavBar user info response:", response.data);

                if (response.data.logged_in) {
                    setUser (response.data.user);
                } else {
                    setUser (null);
                }
            } catch (error) {
                // Improved error logging
                console.error("Detailed NavBar fetch error:", {
                    message: error.message,
                    responseData: error.response?.data,
                    responseStatus: error.response?.status,
                    requestConfig: error.config
                });

                // Set error state
                setError(error.message || "Failed to fetch user information");
                setUser (null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.get("/api/users/logout");
            setUser (null);
            router.push("/users/login");
        } catch (error) {
            console.error("Logout error:", error);
            alert("Logout failed. Please try again.");
        }
    };

    // Error boundary for rendering
    if (error) {
        return (
            <nav className="bg-red-500 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <span>Error: {error}</span>
                    <button 
                        onClick={() => {
                            setError(null);
                            window.location.reload();
                        }}
                        className="bg-white text-red-500 px-4 py-2 rounded"
                    >
                        Retry
                    </button>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-black text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-lg font-bold">
                    Software Course Management System
                </Link>
                <div className="flex items-center space-x-4">
                    {loading ? (
                        <span>Loading...</span>
                    ) : user ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-white">
                                {user.role === 'student' 
                                    ? `WELCOME STUDENT ${user.name}` 
                                    : user.role === 'faculty'
                                    ? `WELCOME FACULTY ${user.name}`
                                    : user.name}
                            </span>
                            <button 
                                onClick={handleLogout} 
                                className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition duration-300"
                            >
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button 
                                    onClick={() => setDropdownOpen(!dropdownOpen)} 
                                    className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition duration-300"
                                >
                                    Faculty Options
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                        <Link 
                                            href="/users/signup/faculty" 
                                            className="block px-4 py-2 text-black hover:bg-gray-200"
                                        >
                                            {/* Register as a Faculty */}
                                            Complete faculty registration
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <Link 
                                href="/users/login" 
                                className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition duration-300"
                            >
                                Log In
                            </Link>
                            <Link 
                                href="/users/signup" 
                                className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition duration-300"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
