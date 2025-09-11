import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not connected" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev");
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
