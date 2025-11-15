import validator from "validator";
import zxcvbn from "zxcvbn";

export function validateRegister(req, res, next) {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid Email." });
  }
  if (zxcvbn(password).score < 3) {
    return res.status(400).json({ error: "Weak Password." });
  }

  next(); // input is valid, continue to controller
}
