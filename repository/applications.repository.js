import { pool } from "../pool/pool.js";

/**
 * Repository des candidatures (applications)
 * Gère les interactions avec la table `applications`
 */
export class ApplicationsRepository {
  /**
   * Crée une nouvelle candidature
   * @param {number} missionId - ID de la mission
   * @param {number} volunteerId - ID du bénévole
   * @param {string|null} note - Note facultative
   * @returns {Promise<object>} La candidature créée
   */
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

  /**
   * Récupère toutes les candidatures d'un bénévole
   * @param {number} volunteerId - ID du bénévole
   * @returns {Promise<object[]>} Liste des candidatures
   */
  async myApplications(volunteerId) {
    const [rows] = await pool.query(
      `SELECT a.*, m.title 
       FROM applications a 
       JOIN missions m ON m.id=a.mission_id
       WHERE a.volunteer_id=?`,
      [volunteerId]
    );
    return rows;
  }

  /**
   * Récupère toutes les candidatures d'une mission
   * @param {number} missionId - ID de la mission
   * @returns {Promise<object[]>} Liste des candidatures
   */
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

  /**
   * Récupère uniquement les candidatures en attente d'une mission
   * @param {number} missionId - ID de la mission
   * @returns {Promise<object[]>} Liste des candidatures en attente
   */
  async listForMissionPending(missionId) {
    const [rows] = await pool.query(
      `SELECT a.*, u.name AS volunteer_name 
       FROM applications a 
       JOIN users u ON u.id=a.volunteer_id
       WHERE a.mission_id=? AND a.status='PENDING'`,
      [missionId]
    );
    return rows;
  }

  /**
   * Change le statut d'une candidature
   * @param {number} id - ID de la candidature
   * @param {"PENDING"|"ACCEPTED"|"REJECTED"} status - Nouveau statut
   * @returns {Promise<object>} La candidature mise à jour
   */
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
