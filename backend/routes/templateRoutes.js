const express = require("express");
const router = express.Router();
const Template = require("../models/Template");

// @route   GET /api/templates
// @desc    Get all templates
router.get("/", async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/templates/:id
// @desc    Get single template by ID
router.get("/:id", async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/templates
// @desc    Create a new template
router.post("/", async (req, res) => {
  try {
    console.log("📥 Received template data:", req.body);
    
    const { name, description, fileUrl } = req.body;

    // Validation
    if (!name || !description || !fileUrl) {
      return res.status(400).json({ 
        message: "Please provide all required fields: name, description, fileUrl" 
      });
    }

    const template = new Template({
      name,
      description,
      fileUrl
    });

    const savedTemplate = await template.save();
    console.log("✅ Template saved:", savedTemplate._id);
    res.status(201).json(savedTemplate);
  } catch (error) {
    console.error("❌ Error saving template:", error);
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/templates/:id
// @desc    Update a template
router.put("/:id", async (req, res) => {
  try {
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    
    res.json(template);
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/templates/:id
// @desc    Delete a template
router.delete("/:id", async (req, res) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    
    res.json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("Error deleting template:", error);
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/templates
// @desc    Delete all templates (for testing)
router.delete("/", async (req, res) => {
  try {
    await Template.deleteMany({});
    res.json({ message: "All templates deleted successfully" });
  } catch (error) {
    console.error("Error deleting templates:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;