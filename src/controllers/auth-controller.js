import * as authService from "../services/auth-service.js";
import * as otpService from "../services/otp-service.js";

// * Register ****************************************************************

export function showRegisterForm(req, res) {
  res.send("GET /auth/register called");
}

export async function registerUser(req, res) {
  try {
    // Getting the email and password of user for registration
    const { email, password } = req.body;

    const result = await authService.registerUser(email, password);

    return res.status(200).json({
      status: 200,
      message:
        "OTP sent to your email, head over to /auth/verify-otp to verify your email.",
      mailURL:
        result.mailURL ||
        "Mail URL is not found, because it was not passed properly.",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Internal server error.", errorDetail: err });
  }
}

// * OTP *********************************************************************
export async function showOTPForm(req, res) {
  res.send("GET /auth/verify-otp called");
}

export async function verifyOTP(req, res) {
  try {
    // Getting the user's entered OTP
    const { email, otp } = req.body;

    const otpValidateResult = await otpService.validateOTP(email, otp);

    res.status(otpValidateResult.status ?? null).json(otpValidateResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
}

// * Login *********************************************************************

export async function showLoginForm(req, res) {
  res.send("GET /auth/login called");
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    return res.status(result.status).json(result);
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
