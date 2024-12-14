import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

const App = () => {
  const [view, setView] = useState("home"); // "home" or "upload"
  const [file, setFile] = useState(null);
  const [songs, setSongs] = useState([]);

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
    <div>
      <header>
        <button onClick={() => setView("home")}>Home</button>
        <button onClick={() => setView("upload")}>Upload</button>
      </header>
      {view === "home" ? (
        <div>
          <h1>Available Songs</h1>
          <ul>
            {songs.map((song, index) => (
              <li key={index}>
                {song}
                <audio controls src={`http://localhost:5000/uploads/${song}`} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h1>Upload Music</h1>
          <input type="file" accept="audio/*" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
        </div>
      )}
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
