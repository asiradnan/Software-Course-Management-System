import { AuthFunctions } from "../components/AuthFunction";
import NavBar from "@/components/NavBar";
export default function Home() {
    return (
        <div>
            <NavBar />
            <main style={styles.main}>
                <h1 style={styles.title}>Welcome User</h1>
                <p style={styles.description}>
                    Please Login to access the website
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
  }
};

