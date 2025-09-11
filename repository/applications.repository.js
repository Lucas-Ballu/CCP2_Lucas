import { pool } from "../pool/pool.js";

export class ApplicationsRepository {
  async create(missionId, volunteerId, note) {
    const [r] = await pool.query(
      "INSERT INTO applications (mission_id, volunteer_id, note) VALUES (?,?,?)",
      [missionId, volunteerId, note || null]
    );
    const [[row]] = await pool.query("SELECT * FROM applications WHERE id=?", [
      r.insertId,
    ]);
    return row;
  }

  async listMine(volunteerId) {
    const [rows] = await pool.query(
      `SELECT a.*, m.title FROM applications a 
       JOIN missions m ON m.id=a.mission_id
       WHERE a.volunteer_id=?`,
      [volunteerId]
    );
    return rows;
  }

  async listForMission(missionId) {
    const [rows] = await pool.query(
      `SELECT a.*, u.name AS volunteer_name 
       FROM applications a 
       JOIN users u ON u.id=a.volunteer_id
       WHERE a.mission_id=?`,
      [missionId]
    );
    return rows;
  }

  async setStatus(id, status) {
    await pool.query("UPDATE applications SET status=? WHERE id=?", [
      status,
      id,
    ]);
    const [[row]] = await pool.query("SELECT * FROM applications WHERE id=?", [
      id,
    ]);
    return row;
  }
}
