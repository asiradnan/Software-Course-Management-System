

"use client";
import NavBar from "@/components/NavBar";

export default function Home() {
    return (
        <div>
            <nav className="navi">Software Course Management System</nav>
            <main style={styles.main}>
                <h1 style={styles.title}>Welcome to Course Management System</h1>
                <p style={styles.description}>
                    Manage your courses, track your progress, and stay connected.
                </p>
            </main>
        </div>
    );
}

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 70px)', // Subtract navbar height
        background: 'linear-gradient(to right, #6a11cb, #2575fc)',
        color: 'white',
        textAlign: 'center',
    },
    title: {
        fontSize: '3rem',
        marginBottom: '20px',
    },
    description: {
        fontSize: '1.5rem',
        maxWidth: '600px',
    },
     
};
