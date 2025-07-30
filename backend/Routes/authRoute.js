import express from "express";
import { register, login, forgotPassword, verifyOTP, resetPassword, checkEmailConfig } from "../controllers/authController.js";
import multer from "multer";
const upload = multer();

const authRoute = express.Router();

authRoute.post("/register", upload.none(), register);
authRoute.post("/login", login);

// Password reset routes
authRoute.post("/forgot-password", forgotPassword);
authRoute.post("/verify-otp", verifyOTP);

authRoute.post("/reset-password", resetPassword);

// Debug route to check email configuration
authRoute.get("/email-config", checkEmailConfig);

export default authRoute;
