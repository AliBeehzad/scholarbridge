const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Template name is required"] 
  },
  description: { 
    type: String, 
    required: [true, "Description is required"] 
  },
  fileUrl: { 
    type: String, 
    required: [true, "File URL is required"] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Template", templateSchema);