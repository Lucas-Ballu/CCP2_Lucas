import jwt from "jsonwebtoken";

/**
 * Middleware d'authentification
 * Vérifie la présence et la validité d'un token JWT dans les cookies.
 *
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @param {import('express').NextFunction} next - Fonction next() d'Express
 * @returns {void} Renvoie 401 si non connecté ou token invalide
 */
export default function auth(req, res, next) {
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
