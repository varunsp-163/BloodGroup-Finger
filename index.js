const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5001;

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

// Set up Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `fingerprint_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// API Endpoint to receive fingerprint image
app.post("/fingerprint", upload.single("fingerprint"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No fingerprint uploaded" });
  }

  console.log(`Fingerprint received: ${req.file.filename}`);
  res.json({ message: "Fingerprint uploaded successfully", filename: req.file.filename });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
