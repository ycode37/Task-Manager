import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import testSendEmail from "../utils/testEmailService.js";
import { generateOTP, generateOTPExpiration } from "../utils/generateOTP.js";

export const register = async (req, res) => {
  try {
    const { username, password, email, role, organization } = req.body;
    if (!username || !password || !email || !role || !organization) {
      return res.json({ success: false, message: "Fill All Entries" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Already User Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if an admin already exists for the organization
    const existingAdmin = await User.findOne({ organization, role: "admin" });

    let userRole = role;
    let adminApproval = false;
    let adminRequestStatus = "none";

    if (role === "admin") {
      if (!existingAdmin) {
        // First admin for the organization
        adminApproval = true;
        adminRequestStatus = "approved";
      } else {
        // Admin already exists, set as pending
        userRole = "user"; // Demote to user until approved
        adminRequestStatus = "pending";
      }
    }

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: userRole,
      organization,
      adminApproval,
      adminRequestStatus,
      adminRequestedAt: role === "admin" && existingAdmin ? new Date() : null,
    });

    if (adminRequestStatus === "pending") {
      return res.json({
        success: true,
        message:
          "Registration successful. Your request to become an admin is pending approval.",
      });
    }

    return res.json({ success: true, message: "User Added Successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = generateOTPExpiration();
    user.isOTPVerified = false;
    await user.save();

    // Determine which email service to use
    const isDevelopmentMode = process.env.DEVELOPMENT_MODE === 'true' || 
                             process.env.GMAIL_USER === 'your-email@gmail.com' ||
                             process.env.GMAIL_PASS === 'your-app-password' ||
                             !process.env.GMAIL_USER ||
                             !process.env.GMAIL_PASS;
                             
    const emailService = isDevelopmentMode ? testSendEmail : sendEmail;
    
    console.log(`📧 Using ${isDevelopmentMode ? 'TEST' : 'REAL'} email service for OTP delivery`);

    try {
      await emailService({
        to: user.email,
        subject: "Password Reset OTP - Task Management System",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
              .content { background-color: #f9f9f9; padding: 30px; }
              .otp-box { background-color: #e8f5e8; border: 2px solid #4CAF50; padding: 20px; text-align: center; margin: 20px 0; }
              .otp-code { font-size: 36px; font-weight: bold; color: #2E7D32; letter-spacing: 8px; }
              .warning { color: #FF5722; font-weight: bold; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Password Reset Request</h2>
              </div>
              <div class="content">
                <h3>Hello ${user.username},</h3>
                <p>We received a request to reset your password for your Task Management System account.</p>
                <p>Your One-Time Password (OTP) is:</p>
                <div class="otp-box">
                  <div class="otp-code">${otp}</div>
                </div>
                <p><strong>Important:</strong></p>
                <ul>
                  <li>This OTP will expire in <span class="warning">10 minutes</span></li>
                  <li>Do not share this OTP with anyone</li>
                  <li>If you didn't request this, please ignore this email</li>
                </ul>
                <p>Thank you,<br>Task Management System Team</p>
              </div>
              <div class="footer">
                <p>This is an automated email. Please do not reply to this message.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      res
        .status(200)
        .json({ success: true, message: "OTP sent to your email" });
    } catch (error) {
      console.error("Error sending email:", error);
      res
        .status(500)
        .json({ success: false, message: "Error sending OTP email" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    user.isOTPVerified = true;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.isOTPVerified) {
      return res
        .status(400)
        .json({ success: false, message: "OTP not verified" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    user.isOTPVerified = false;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Debug endpoint to check email configuration
export const checkEmailConfig = async (req, res) => {
  try {
    const isDevelopmentMode = process.env.DEVELOPMENT_MODE === 'true' || 
                             process.env.GMAIL_USER === 'your-email@gmail.com' ||
                             process.env.GMAIL_PASS === 'your-app-password' ||
                             !process.env.GMAIL_USER ||
                             !process.env.GMAIL_PASS;

    const config = {
      developmentMode: isDevelopmentMode,
      emailService: isDevelopmentMode ? 'TEST (Console)' : 'REAL (Gmail)',
      gmailConfigured: process.env.GMAIL_USER && process.env.GMAIL_USER !== 'your-email@gmail.com',
      gmailUser: process.env.GMAIL_USER ? process.env.GMAIL_USER.replace(/(.{3}).*(@.*)/, '$1***$2') : 'Not set',
      status: isDevelopmentMode ? 'OTP will appear in server console' : 'OTP will be sent via email'
    };

    res.json({
      success: true,
      message: 'Email configuration status',
      config
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.json({ success: false, message: "Enter Full Details" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Register Kar Pahele" });
    }
    //bcrypt compare tabhi kaam karega jab hamne pehle se already paasswor dko hash kiya hoga
    if (!user.password) {
      return res.json({
        success: false,
        message: "Password not found. Please contact support or re-register.",
      });
    }
    // === nahi aaega , aaega compare ke waqt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      organization: user.organization,
      adminRequestStatus: user.adminRequestStatus,
      adminApproval: user.adminApproval,
    };
    return res.json({
      success: true,
      message: "Login Successfully",
      user: userResponse,
      token: token,
    });
  } catch (error) {
    return res.json({ success: false, message: "Internal Server Error" });
  }
};
