import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

const App = () => {
  const [view, setView] = useState("home"); // "home" or "upload"
  const [file, setFile] = useState(null);
  const [songs, setSongs] = useState([]);

  // Inline styles
  const styles = {
    appContainer: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      fontFamily: "'Poppins', Arial, sans-serif", // Modern font
      backgroundColor: "#1e1e1e", // Dark background
      color: "#e0e0e0", // Light gray text
      margin: 0,
      padding: 0,
    },
    header: {
      backgroundColor: "#003865", // Dark blue
      color: "white",
      padding: "1.5rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "2px solid #004b91",
      borderRadius: "0 0 15px 15px", // Curved bottom edges
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Shadow for depth
    },
    navButton: {
      background: "none",
      border: "2px solid white",
      color: "white",
      fontSize: "1rem",
      marginLeft: "1rem",
      padding: "0.5rem 1rem",
      borderRadius: "25px", // Fully rounded buttons
      cursor: "pointer",
      transition: "all 0.3s ease", // Smooth hover effect
    },
    navButtonActive: {
      backgroundColor: "#004b91", // Highlight active button
      color: "#ffffff",
      border: "2px solid #004b91",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // Add shadow for focus
    },
    navButtonHover: {
      backgroundColor: "#005fa3",
      transform: "scale(1.05)", // Subtle scaling effect
    },
    mainContent: {
      flex: 1,
      padding: "2rem",
      borderRadius: "15px", // Rounded edges
      backgroundColor: "#242424", // Slightly lighter content area
      margin: "1rem auto",
      maxWidth: "800px",
      boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.3)", // Depth for content
    },
    sectionTitle: {
      marginBottom: "1rem",
      fontSize: "1.8rem",
      fontWeight: "600",
      color: "#ffffff",
    },
    songList: {
      listStyleType: "none",
      padding: 0,
      margin: 0,
    },
    songItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#2a2a2a",
      padding: "1rem",
      marginBottom: "1rem",
      borderRadius: "10px", // Rounded card corners
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Shadow for depth
      transition: "transform 0.2s ease", // Smooth scaling on hover
    },
    songItemHover: {
      transform: "scale(1.02)", // Slightly bigger on hover
    },
    uploadInput: {
      marginBottom: "1rem",
      padding: "0.5rem",
      border: "2px solid #444",
      borderRadius: "10px", // Rounded edges for input
      backgroundColor: "#2a2a2a",
      color: "#e0e0e0",
    },
    uploadButton: {
      padding: "0.5rem 1.5rem",
      backgroundColor: "#004b91",
      color: "white",
      border: "none",
      borderRadius: "25px", // Rounded button
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontWeight: "500",
    },
    uploadButtonHover: {
      backgroundColor: "#003865",
      transform: "scale(1.05)", // Slightly larger on hover
    },
    footer: {
      backgroundColor: "#121212", // Very dark footer
      color: "#e0e0e0",
      textAlign: "center",
      padding: "1.5rem",
      marginTop: "1rem",
      borderRadius: "15px 15px 0 0", // Curved top edges
      boxShadow: "0px -4px 6px rgba(0, 0, 0, 0.2)",
    },
  };
  
  

  // Fetch songs on load
  useEffect(() => {
    if (view === "home") {
      axios.get("http://localhost:5000/music").then((response) => {
        setSongs(response.data);
      });
    }
  }, [view]);

  // Handle file upload
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("music", file);

    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully!");
      setView("home"); // Go back to home after upload
    } catch (error) {
      console.error("Upload failed", error);
      alert("Error uploading file.");
    }
  };

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1>Music Uploader</h1>
        <nav>
          <button
            style={{
              ...styles.navButton,
              ...(view === "home" ? styles.navButtonActive : {}),
            }}
            onClick={() => setView("home")}
          >
            Home
          </button>
          <button
            style={{
              ...styles.navButton,
              ...(view === "upload" ? styles.navButtonActive : {}),
            }}
            onClick={() => setView("upload")}
          >
            Upload
          </button>
        </nav>
      </header>

      <main style={styles.mainContent}>
        {view === "home" ? (
          <div>
            <h2 style={styles.sectionTitle}>Available Songs</h2>
            <ul style={styles.songList}>
              {songs.map((song, index) => (
                <li key={index} style={styles.songItem}>
                  <p>{song}</p>
                  <audio controls src={`http://localhost:5000/uploads/${song}`} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <h2 style={styles.sectionTitle}>Upload Music</h2>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              style={styles.uploadInput}
            />
            <button onClick={handleUpload} style={styles.uploadButton}>
              Upload
            </button>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p>&copy; 2024 Music Uploader. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Render App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
