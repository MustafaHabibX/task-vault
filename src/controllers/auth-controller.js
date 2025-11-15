import * as authService from "../services/auth-service.js";

export function showRegisterForm(req, res) {
  res.send("GET /register called");
}

export async function registerUser(req, res) {
  try {
    // Getting the email and password of user for registration
    const { email, password } = req.body;

    const result = await authService.registerUser(email, password);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Internal server error.", errorDetail: err });
  }
}
