import argon2 from "argon2";
import { UserRepository } from "../repository/users.repository.js";

const userRepo = new UserRepository();

/**
 * Service d'authentification et de gestion des utilisateurs
 */
export class AuthService {
  /**
   * Inscrit un nouvel utilisateur
   * @param {{ role:'VOLUNTEER'|'ASSOCIATION', email:string, password:string, name:string }} data - Données du nouvel utilisateur
   * @returns {Promise<{id:number, role:string, email:string, name:string}>} L'utilisateur créé
   */
  async register({ role, email, password, name }) {
    const hash = await argon2.hash(password);
    return userRepo.create(role, email, hash, name);
  }

  /**
   * Connecte un utilisateur existant
   * @param {{ email:string, password:string }} data - Identifiants de l'utilisateur
   * @returns {Promise<{token:string, user:{id:number,role:string,email:string,name:string}}>} Jeton et infos de l'utilisateur
   * @throws {Error} Si l'email ou le mot de passe est invalide
   */
  async login({ email, password }) {
    const u = await userRepo.findByEmail(email);
    if (!u) throw new Error("invalid email");
    const ok = await argon2.verify(u.password_hash, password);
    if (!ok) throw new Error("invalid password");
    return {
      token: sign(u),
      user: { id: u.id, role: u.role, email: u.email, name: u.name },
    };
  }
}
