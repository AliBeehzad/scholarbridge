const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Title is required"] 
  },
  country: { 
    type: String, 
    required: [true, "Country is required"] 
  },
  degree: { 
    type: String, 
    required: [true, "Degree is required"] 
  },
  deadline: { 
    type: String, 
    required: [true, "Deadline is required"] 
  },
  description: { 
    type: String, 
    required: [true, "Description is required"] 
  },
  benefits: { 
    type: String, 
    default: "" 
  },
  requirements: { 
    type: String, 
    default: "" 
  },
  officialLink: { 
    type: String, 
    required: [true, "Official link is required"] 
  },
  youtubeLink: { 
    type: String, 
    default: "" 
  },
  image: { 
    type: String, 
    default: "" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Scholarship", scholarshipSchema);