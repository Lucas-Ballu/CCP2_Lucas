import { pool } from "../pool/pool.js";

export class UserRepository {
  async create(role, email, hash, name) {
    const [r] = await pool.query(
      "INSERT INTO users (role,email,password_hash,name) VALUES (?,?,?,?)",
      [role, email, hash, name]
    );
    return { id: r.insertId, role, email, name };
  }

  async findByEmail(email) {
    const [[u]] = await pool.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    return u || null;
  }
}
