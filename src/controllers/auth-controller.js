import * as authService from "../services/auth-service.js";
import * as otpService from "../services/otp-service.js";

// Register ****************************************************************

export function showRegisterForm(req, res) {
  res.send("GET /register called");
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
