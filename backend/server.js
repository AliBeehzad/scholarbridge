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

// ============ CONTACT SCHEMA (Optional - for storing messages in DB) ============
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

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

// GET single scholarship
app.get("/api/scholarships/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const scholarship = await Scholarship.findById(req.params.id);
      if (!scholarship) {
        return res.status(404).json({ message: "Scholarship not found" });
      }
      res.json(scholarship);
    } else {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "scholarships.json")));
      const scholarship = data.find(s => s._id === req.params.id);
      if (!scholarship) {
        return res.status(404).json({ message: "Scholarship not found" });
      }
      res.json(scholarship);
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

// PUT update scholarship
app.put("/api/scholarships/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const scholarship = await Scholarship.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!scholarship) {
        return res.status(404).json({ message: "Scholarship not found" });
      }
      res.json(scholarship);
    } else {
      const filePath = path.join(__dirname, "data", "scholarships.json");
      let scholarships = JSON.parse(fs.readFileSync(filePath));
      const index = scholarships.findIndex(s => s._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: "Scholarship not found" });
      }
      scholarships[index] = { ...scholarships[index], ...req.body, _id: req.params.id };
      fs.writeFileSync(filePath, JSON.stringify(scholarships, null, 2));
      res.json(scholarships[index]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE scholarship
app.delete("/api/scholarships/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
      if (!scholarship) {
        return res.status(404).json({ message: "Scholarship not found" });
      }
      res.json({ message: "Scholarship deleted successfully" });
    } else {
      const filePath = path.join(__dirname, "data", "scholarships.json");
      let scholarships = JSON.parse(fs.readFileSync(filePath));
      scholarships = scholarships.filter(s => s._id !== req.params.id);
      fs.writeFileSync(filePath, JSON.stringify(scholarships, null, 2));
      res.json({ message: "Scholarship deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ TEMPLATE ROUTES ============

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

// GET single template
app.get("/api/templates/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const template = await Template.findById(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } else {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "templates.json")));
      const template = data.find(t => t._id === req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
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

// PUT update template
app.put("/api/templates/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const template = await Template.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } else {
      const filePath = path.join(__dirname, "data", "templates.json");
      let templates = JSON.parse(fs.readFileSync(filePath));
      const index = templates.findIndex(t => t._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: "Template not found" });
      }
      templates[index] = { ...templates[index], ...req.body, _id: req.params.id };
      fs.writeFileSync(filePath, JSON.stringify(templates, null, 2));
      res.json(templates[index]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE template
app.delete("/api/templates/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const template = await Template.findByIdAndDelete(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json({ message: "Template deleted successfully" });
    } else {
      const filePath = path.join(__dirname, "data", "templates.json");
      let templates = JSON.parse(fs.readFileSync(filePath));
      templates = templates.filter(t => t._id !== req.params.id);
      fs.writeFileSync(filePath, JSON.stringify(templates, null, 2));
      res.json({ message: "Template deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ CONTACT ROUTE (NEW!) ============
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide name, email, and message" 
      });
    }

    console.log("📬 New contact form submission:", { name, email });

    // Store in database if connected
    if (mongoose.connection.readyState === 1) {
      const contact = new Contact({ name, email, message });
      await contact.save();
      console.log("✅ Contact message saved to database");
    } else {
      // Fallback to JSON file
      const CONTACT_FILE = path.join(__dirname, "data", "contacts.json");
      let contacts = [];
      if (fs.existsSync(CONTACT_FILE)) {
        contacts = JSON.parse(fs.readFileSync(CONTACT_FILE));
      }
      contacts.push({
        _id: Date.now().toString(),
        name, email, message,
        createdAt: new Date().toISOString()
      });
      fs.writeFileSync(CONTACT_FILE, JSON.stringify(contacts, null, 2));
      console.log("✅ Contact message saved to JSON file");
    }

    // For now, just return success (email functionality can be added later)
    res.status(200).json({ 
      success: true, 
      message: "Thank you! Your message has been sent successfully." 
    });

  } catch (error) {
    console.error("❌ Contact form error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send message. Please try again later." 
    });
  }
});

// GET all contact messages (protected - you might want to add admin auth later)
app.get("/api/contact", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const messages = await Contact.find().sort({ createdAt: -1 });
      res.json(messages);
    } else {
      const CONTACT_FILE = path.join(__dirname, "data", "contacts.json");
      if (fs.existsSync(CONTACT_FILE)) {
        const data = fs.readFileSync(CONTACT_FILE);
        res.json(JSON.parse(data));
      } else {
        res.json([]);
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ SEED DATABASE ============
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

// ============ TEST ROUTE ============
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
      "PUT /api/scholarships/:id",
      "DELETE /api/scholarships/:id",
      "GET /api/templates",
      "POST /api/templates",
      "PUT /api/templates/:id",
      "DELETE /api/templates/:id",
      "POST /api/contact",
      "GET /api/contact",
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
  🚀  Contact: POST /api/contact
  🚀 ====================================
  `);
});