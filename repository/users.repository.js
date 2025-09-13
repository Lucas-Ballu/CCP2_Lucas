import { pool } from "../pool/pool.js";

/**
 * Repository des utilisateurs
 * Gère les interactions avec la table `users`
 */
export class UserRepository {
  /**
   * Crée un nouvel utilisateur
   * @param {"VOLUNTEER"|"ASSOCIATION"} role - Rôle de l'utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} hash - Mot de passe déjà hashé
   * @param {string} name - Nom de l'utilisateur
   * @returns {Promise<object>} L'utilisateur créé (id, role, email, name)
   */
  async create(role, email, hash, name) {
    const [r] = await pool.query(
      "INSERT INTO users (role,email,password_hash,name) VALUES (?,?,?,?)",
      [role, email, hash, name]
    );
    return { id: r.insertId, role, email, name };
  }

  /**
   * Trouve un utilisateur par son email
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<object|null>} L'utilisateur trouvé ou null
   */
  async findByEmail(email) {
    const [[u]] = await pool.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    return u || null;
  }
}
