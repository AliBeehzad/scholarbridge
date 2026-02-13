const express = require("express");
const router = express.Router();
const Scholarship = require("../models/Scholarship");

// @route   GET /api/scholarships
// @desc    Get all scholarships
router.get("/", async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    res.json(scholarships);
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/scholarships/:id
// @desc    Get single scholarship by ID
router.get("/:id", async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship not found" });
    }
    res.json(scholarship);
  } catch (error) {
    console.error("Error fetching scholarship:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/scholarships
// @desc    Create a new scholarship
router.post("/", async (req, res) => {
  try {
    console.log("📥 Received scholarship data:", req.body);
    
    const { 
      title, country, degree, deadline, description, 
      benefits, requirements, officialLink, youtubeLink, image 
    } = req.body;

    // Validation
    if (!title || !country || !degree || !deadline || !description || !officialLink) {
      return res.status(400).json({ 
        message: "Please provide all required fields: title, country, degree, deadline, description, officialLink" 
      });
    }

    const scholarship = new Scholarship({
      title,
      country,
      degree,
      deadline,
      description,
      benefits: benefits || "",
      requirements: requirements || "",
      officialLink,
      youtubeLink: youtubeLink || "",
      image: image || ""
    });

    const savedScholarship = await scholarship.save();
    console.log("✅ Scholarship saved:", savedScholarship._id);
    res.status(201).json(savedScholarship);
  } catch (error) {
    console.error("❌ Error saving scholarship:", error);
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/scholarships/:id
// @desc    Update a scholarship
router.put("/:id", async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship not found" });
    }
    
    res.json(scholarship);
  } catch (error) {
    console.error("Error updating scholarship:", error);
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/scholarships/:id
// @desc    Delete a scholarship
router.delete("/:id", async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
    
    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship not found" });
    }
    
    res.json({ message: "Scholarship deleted successfully" });
  } catch (error) {
    console.error("Error deleting scholarship:", error);
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/scholarships
// @desc    Delete all scholarships (for testing)
router.delete("/", async (req, res) => {
  try {
    await Scholarship.deleteMany({});
    res.json({ message: "All scholarships deleted successfully" });
  } catch (error) {
    console.error("Error deleting scholarships:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;