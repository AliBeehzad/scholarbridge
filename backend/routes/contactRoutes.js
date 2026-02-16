const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// POST /api/contact - Send contact form message
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide name, email, and message" 
      });
    }

    // Create transporter (using Gmail - you'll need to enable "App Password")
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "alibeehzadzai@gmail.com", // Your email
        pass: "YOUR_APP_PASSWORD" // NOT your regular password! Use App Password
      }
    });

    // Email options
    const mailOptions = {
      from: `"ScholarBridge Contact" <${email}>`,
      to: "alibeehzadzai@gmail.com", // Your email where you want to receive messages
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #2563eb;">📬 New Contact Form Submission</h2>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong style="color: #374151;">Name:</strong> ${name}</p>
            <p><strong style="color: #374151;">Email:</strong> ${email}</p>
            <p><strong style="color: #374151;">Message:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 8px;">${message}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">Sent from ScholarBridge Contact Form</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Also store in database (optional)
    // You can create a Contact model if you want to save messages

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

module.exports = router;