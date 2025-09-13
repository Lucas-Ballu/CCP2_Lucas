import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { AuthService } from "../services/users.services.js";
import { UserRepository } from "../repository/users.repository.js";

const userRepo = new UserRepository();
const authService = new AuthService();

/**
 * Contrôleur d'authentification des utilisateurs
 * Gère l'inscription, la connexion et la déconnexion.
 */
export class AuthController {
  /**
   * POST /register
   * @summary Inscription d'un nouvel utilisateur (bénévole ou association)
   * @param {import('express').Request} req - body: { role:"VOLUNTEER"|"ASSOCIATION", email:string, password:string, name:string }
   * @param {import('express').Response} res
   * @returns {Promise<void>} 201 si créé, 400 si champs manquants, 409 si email déjà utilisé
   */
  async register(req, res) {
    try {
      const { role, email, password, name } = req.body;
      if (!role || !email || !password || !name) {
        return res.status(400).json({ message: "Champs manquants" });
      }

      const u = await authService.register({ role, email, password, name });
      res.status(201).json(u);
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Email déjà utilisé" });
      }
      console.error("Erreur register:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  /**
   * POST /login
   * @summary Connexion d'un utilisateur
   * @param {import('express').Request} req - body: { email:string, password:string }
   * @param {import('express').Response} res
   * @returns {Promise<void>} 200 avec le token et infos user, 400 si champs manquants, 401 si identifiants invalides
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Champs manquants" });
      }

      const user = await userRepo.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }

      const ok = await argon2.verify(user.password_hash, password);
      if (!ok) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role, name: user.name },
        process.env.JWT_SECRET || "dev",
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        expires: new Date(Date.now() + 3600000),
      });

      res.json({
        message: "Connecté",
        user: { id: user.id, name: user.name, role: user.role },
      });
    } catch (err) {
      console.error("Erreur login:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  /**
   * POST /logout
   * @summary Déconnexion de l'utilisateur
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void} 200 si déconnecté
   */
  logout(req, res) {
    res.clearCookie("token");
    res.json({ message: "Déconnecté" });
  }
}
