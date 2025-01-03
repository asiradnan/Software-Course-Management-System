// import { AuthFunctions } from "../components/AuthFunction";
// import NavBar from "@/components/NavBar";
// export default function Home() {
//     return (
//         <div>
//             <NavBar />
//             <main style={styles.main}>
//                 <h1 style={styles.title}>Welcome User</h1>
//                 <p style={styles.description}>
//                     Please Login to access the website
//                 </p>
//                 {/* Button to navigate to Profile page using an anchor tag */}
//                 {user && (
//                     <a href="/users/profile" style={styles.profileButton}>
//                         Go to Profile
//                     </a>
//                 )}
//             </main>
            
//         </div>
//     );
// }
// const styles = {
//   main: {
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       minHeight: 'calc(100vh - 70px)', // Subtract navbar height
//       background: 'linear-gradient(to right, #6a11cb, #2575fc)',
//       color: 'white',
//       textAlign: 'center',
//   },
//   title: {
//       fontSize: '3rem',
//       marginBottom: '20px',
//   },
//   description: {
//       fontSize: '1.5rem',
//       maxWidth: '600px',
//   }
// };

"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";

export default function UsersPage() {
    const [user, setUser ] = useState(null);
    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get("/api/users/userinfo");
                if (response.data.logged_in) {
                    setUser (response.data.user);
                    setMessage(`Welcome, ${response.data.user.name}!`);
                } else {
                    setMessage("Please log in to access your profile.");
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
                setMessage("Error fetching user information.");
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <>
            <NavBar />
            <div style={styles.container}>
                <h1 style={styles.heading}>Users Page</h1>
                <p style={styles.heading}>{message}</p>

                {/* Button to navigate to Profile page using an anchor tag */}
                {user && (
                    <a href="/users/profile" style={styles.profileButton}>
                        Go to Profile
                    </a>
                )}
            </div>
        </>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        background: 'white',
    },
    heading: {
        fontSize: "24px",
        marginBottom: "20px",
        color: 'black',
    },
    profileButton: {
        display: "inline-block",
        background: "#007bff", // Profile button color
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        fontSize: "16px",
        textDecoration: "none", // Remove underline
        marginTop: "20px",
        transition: "background 0.3s",
    },
};