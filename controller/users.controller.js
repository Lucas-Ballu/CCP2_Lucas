import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { AuthService } from "../services/users.services.js";
import { UserRepository } from "../repository/users.repository.js";

const userRepo = new UserRepository();

const authService = new AuthService();

export class AuthController {
  async register(req, res) {
    const { role, email, password, name } = req.body;
    if (!role || !email || !password || !name)
      return res.status(400).json({ message: "Missing required fields" });
    const u = await authService.register({ role, email, password, name });
    res.status(201).json(u);
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const user = await userRepo.findByEmail(email);
      if (!user)
        return res.status(401).json({ message: "invalid identifier " });

      const ok = await argon2.verify(user.password_hash, password);
      if (!ok) return res.status(401).json({ message: "invalid identifier" });

      const token = jwt.sign(
        { id: user.id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        expires: new Date(Date.now() + 3600000),
      });

      res.json({
        message: "Connected",
        user: { id: user.id, name: user.name, role: user.role },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  logout(req, res) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.json({ message: "Disconnected" });
  }
}
