import { pool } from "../pool/pool.js";

export class MissionRepository {
  async list() {
    const [rows] = await pool.query(
      "SELECT m.*, u.name AS association_name FROM missions m JOIN users u ON u.id=m.association_id"
    );
    return rows;
  }

  async create(title, desc, date, association_id) {
    const [r] = await pool.query(
      "INSERT INTO missions (title,description,date,association_id) VALUES (?,?,?,?)",
      [title, desc, date, association_id]
    );
    const [[m]] = await pool.query("SELECT * FROM missions WHERE id=?", [
      r.insertId,
    ]);
    return m;
  }

  async findById(id) {
    const [[m]] = await pool.query("SELECT * FROM missions WHERE id=?", [id]);
    return m || null;
  }

  async remove(id) {
    const [r] = await pool.query("DELETE FROM missions WHERE id=?", [id]);
    return r.affectedRows > 0;
  }

  async update(id, title, description, date) {
    await pool.query(
      "UPDATE missions SET title=?, description=?, date=? WHERE id=?",
      [title, description, date, id]
    );
    const [[m]] = await pool.query("SELECT * FROM missions WHERE id=?", [id]);
    return m;
  }
}
