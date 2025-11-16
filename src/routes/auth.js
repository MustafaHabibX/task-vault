import express from "express";
import * as authController from "../controllers/auth-controller.js";
import { validateRegister } from "../middlewares/validate-register.js";

const router = express.Router();

// *  Register ****************************************************************
router.get("/register", authController.showRegisterForm);

router.post("/register", validateRegister, authController.registerUser);

// * OTP *********************************************************************
router.get("/verify-otp", authController.showOTPForm);

router.post("/verify-otp", authController.verifyOTP);

export default router;
