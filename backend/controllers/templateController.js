const Template = require("../models/Template");

// Add template
exports.createTemplate = async (req, res) => {
  try {
    const template = new Template(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all templates
exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete template
exports.deleteTemplate = async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: "Template deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
