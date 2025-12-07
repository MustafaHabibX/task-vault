import jwt from "jsonwebtoken";

export function authenticateJWT(req, res, next) {
  const authHeaderToken = req.headers.authorization;

  if (!authHeaderToken) {
    return res.status(401).json({ error: "Authorization header missing." });
  }

  const token = authHeaderToken.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id, email: decoded.email }; // attach user's info

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired." });
    } else {
      return res.status(403).json({ error: "Invalid token." });
    }
  }
}
