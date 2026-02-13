const Scholarship = require("../models/Scholarship");

// Add scholarship
exports.createScholarship = async (req, res) => {
  try {
    const scholarship = new Scholarship(req.body);
    await scholarship.save();
    res.status(201).json(scholarship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all scholarships
exports.getScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    res.json(scholarships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single scholarship
exports.getScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    res.json(scholarship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete scholarship
exports.deleteScholarship = async (req, res) => {
  try {
    await Scholarship.findByIdAndDelete(req.params.id);
    res.json({ message: "Scholarship deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
