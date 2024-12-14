const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow requests from other origins
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Routes
// 1. File upload route
app.post("/upload", upload.single("music"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ filePath: `http://localhost:${PORT}/${req.file.filename}` });
});

// 2. Get list of uploaded files
app.get("/music", (req, res) => {
  const directoryPath = path.join(__dirname, "uploads");

  // Read the 'uploads' directory
  const fs = require("fs");
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to scan files" });
    }
    res.json(files); // Send the list of files
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
