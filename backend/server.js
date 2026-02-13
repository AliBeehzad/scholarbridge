const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// ============ 🔴 FORCE LOAD .env FILE - CRITICAL FIX ============
const dotenv = require('dotenv');
// Use ABSOLUTE PATH to your .env file
const envPath = path.resolve(__dirname, '.env');
console.log('🔍 Looking for .env at:', envPath);

// Check if file exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found!');
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.error('❌ Error parsing .env:', result.error);
  } else {
    console.log('✅ .env file loaded successfully!');
  }
} else {
  console.error('❌ .env file NOT FOUND at:', envPath);
}

// ============ DEBUG: Check if MONGODB_URI is loaded ============
console.log('📊 Environment variables after loading:');
console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);
if (process.env.MONGODB_URI) {
  // Show first 20 chars only for security
  console.log('- MONGODB_URI starts with:', process.env.MONGODB_URI.substring(0, 20) + '...');
} else {
  console.log('- MONGODB_URI is UNDEFINED!');
}
console.log('- PORT:', process.env.PORT || '5000 (default)');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ MongoDB Atlas Connection ============
console.log("🔄 Connecting to MongoDB Atlas...");

// 🔴 MANUAL CONNECTION STRING - PUT YOUR ACTUAL STRING HERE TEMPORARILY
// This is just to test if MongoDB Atlas works
const MONGODB_URI = process.env.MONGODB_URI || ""; // Will try .env first

if (!MONGODB_URI) {
  console.error('❌ NO MONGODB_URI FOUND! Please check your .env file');
  initializeJsonStorage();
} else {
  mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas!");
    console.log("📁 Database:", mongoose.connection.name);
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.log("⚠️ Falling back to JSON file storage...");
    initializeJsonStorage();
  });
}

// ============ JSON FALLBACK STORAGE ============
function initializeJsonStorage() {
  const DATA_DIR = path.join(__dirname, "data");
  const SCHOLARSHIPS_FILE = path.join(DATA_DIR, "scholarships.json");
  const TEMPLATES_FILE = path.join(DATA_DIR, "templates.json");

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log("📁 Created data directory");
  }
  if (!fs.existsSync(SCHOLARSHIPS_FILE)) {
    fs.writeFileSync(SCHOLARSHIPS_FILE, JSON.stringify([]));
    console.log("📄 Created scholarships.json");
  }
  if (!fs.existsSync(TEMPLATES_FILE)) {
    fs.writeFileSync(TEMPLATES_FILE, JSON.stringify([]));
    console.log("📄 Created templates.json");
  }
}

// ============ SCHOLARSHIP SCHEMA ============
const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  country: { type: String, required: true },
  degree: { type: String, required: true },
  deadline: { type: String, required: true },
  description: { type: String, required: true },
  benefits: { type: String, default: "" },
  requirements: { type: String, default: "" },
  officialLink: { type: String, required: true },
  youtubeLink: { type: String, default: "" },
  image: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  fileUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);
const Template = mongoose.model('Template', templateSchema);

// ============ API ROUTES ============

// GET all scholarships
app.get("/api/scholarships", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const scholarships = await Scholarship.find().sort({ createdAt: -1 });
      res.json(scholarships);
    } else {
      const data = fs.readFileSync(path.join(__dirname, "data", "scholarships.json"));
      res.json(JSON.parse(data));
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create scholarship
app.post("/api/scholarships", async (req, res) => {
  try {
    console.log("📥 Received scholarship:", req.body.title);
    
    const { title, country, degree, deadline, description, benefits, requirements, officialLink, youtubeLink, image } = req.body;

    if (!title || !country || !degree || !deadline || !description || !officialLink) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (mongoose.connection.readyState === 1) {
      const scholarship = new Scholarship({
        title, country, degree, deadline, description,
        benefits: benefits || "",
        requirements: requirements || "",
        officialLink,
        youtubeLink: youtubeLink || "",
        image: image || ""
      });
      const saved = await scholarship.save();
      console.log("✅ Saved to MongoDB Atlas!");
      res.status(201).json(saved);
    } else {
      // JSON fallback
      const filePath = path.join(__dirname, "data", "scholarships.json");
      const scholarships = JSON.parse(fs.readFileSync(filePath));
      const newScholarship = {
        _id: Date.now().toString(),
        title, country, degree, deadline, description,
        benefits: benefits || "", requirements: requirements || "",
        officialLink, youtubeLink: youtubeLink || "", image: image || "",
        createdAt: new Date().toISOString()
      };
      scholarships.push(newScholarship);
      fs.writeFileSync(filePath, JSON.stringify(scholarships, null, 2));
      console.log("✅ Saved to JSON file!");
      res.status(201).json(newScholarship);
    }
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET all templates
app.get("/api/templates", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const templates = await Template.find().sort({ createdAt: -1 });
      res.json(templates);
    } else {
      const data = fs.readFileSync(path.join(__dirname, "data", "templates.json"));
      res.json(JSON.parse(data));
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create template
app.post("/api/templates", async (req, res) => {
  try {
    console.log("📥 Received template:", req.body.name);
    
    const { name, description, fileUrl } = req.body;

    if (!name || !description || !fileUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (mongoose.connection.readyState === 1) {
      const template = new Template({ name, description, fileUrl });
      const saved = await template.save();
      console.log("✅ Saved to MongoDB Atlas!");
      res.status(201).json(saved);
    } else {
      const filePath = path.join(__dirname, "data", "templates.json");
      const templates = JSON.parse(fs.readFileSync(filePath));
      const newTemplate = {
        _id: Date.now().toString(),
        name, description, fileUrl,
        createdAt: new Date().toISOString()
      };
      templates.push(newTemplate);
      fs.writeFileSync(filePath, JSON.stringify(templates, null, 2));
      console.log("✅ Saved to JSON file!");
      res.status(201).json(newTemplate);
    }
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// SEED DATABASE
app.post("/api/seed", async (req, res) => {
  try {
    const sampleScholarships = [
      {
        title: "Fulbright Scholarship 2024",
        country: "USA",
        degree: "Masters, PhD",
        deadline: "2024-10-15",
        description: "Fully funded scholarship for international students to study in the USA.",
        benefits: "Full tuition, living stipend, health insurance, travel allowance",
        requirements: "Bachelor's degree, English proficiency, GRE/GMAT",
        officialLink: "https://fulbright.edu",
        youtubeLink: "https://youtube.com/watch?v=fulbright",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1"
      },
      {
        title: "Chevening Scholarships",
        country: "UK",
        degree: "Masters",
        deadline: "2024-11-07",
        description: "UK government's global scholarship program for future leaders.",
        benefits: "Full tuition, monthly stipend, travel costs, arrival allowance",
        requirements: "2+ years work experience, Bachelor's degree",
        officialLink: "https://chevening.org",
        youtubeLink: "https://youtube.com/watch?v=chevening",
        image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846"
      }
    ];

    if (mongoose.connection.readyState === 1) {
      await Scholarship.deleteMany({});
      await Scholarship.insertMany(sampleScholarships);
      res.json({ message: "✅ MongoDB Atlas seeded!" });
    } else {
      const filePath = path.join(__dirname, "data", "scholarships.json");
      fs.writeFileSync(filePath, JSON.stringify(sampleScholarships, null, 2));
      res.json({ message: "✅ JSON file seeded!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// TEST ROUTE
app.get("/api/test", (req, res) => {
  const status = mongoose.connection.readyState === 1 ? "✅ Connected to MongoDB Atlas" : "⚠️ Using JSON file storage";
  res.json({
    message: "🚀 Backend is running!",
    database: status,
    mongodb_uri_exists: !!process.env.MONGODB_URI,
    env_path: envPath,
    endpoints: [
      "GET /api/scholarships",
      "POST /api/scholarships",
      "GET /api/templates",
      "POST /api/templates",
      "POST /api/seed"
    ]
  });
});

app.get("/", (req, res) => {
  res.send("🚀 ScholarBridge API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🚀 ====================================
  🚀  Server running on port ${PORT}
  🚀  Database: ${mongoose.connection.readyState === 1 ? "✅ MongoDB Atlas" : "⚠️ JSON File"}
  🚀  http://localhost:${PORT}
  🚀  Test: http://localhost:${PORT}/api/test
  🚀 ====================================
  `);
});