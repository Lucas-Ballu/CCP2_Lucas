import { pool } from "../pool/pool.js";

/**
 * Repository des missions
 * Gère les interactions avec la table `missions`
 */
export class MissionRepository {
  /**
   * Récupère toutes les missions avec le nom de l'association
   * @returns {Promise<object[]>} Liste des missions
   */
  async list() {
    const [rows] = await pool.query(
      "SELECT m.*, u.name AS association_name FROM missions m JOIN users u ON u.id=m.association_id"
    );
    return rows;
  }

  /**
   * Récupère les candidatures liées à une mission (pour vérifier les en attente)
   * @param {number} missionId - ID de la mission
   * @returns {Promise<object[]>} Liste des candidatures associées à la mission
   */
  async listForMissionPending(missionId) {
    const [rows] = await pool.query(
      `SELECT a.*, u.name AS volunteer_name
       FROM applications a
       JOIN users u ON u.id = a.volunteer_id
       WHERE a.mission_id = ?`,
      [missionId]
    );
    return rows;
  }

  /**
   * Crée une nouvelle mission
   * @param {string} title - Titre de la mission
   * @param {string} desc - Description de la mission
   * @param {string} date - Date de la mission (YYYY-MM-DD HH:MM:SS)
   * @param {number} association_id - ID de l'association qui crée la mission
   * @returns {Promise<object>} La mission créée
   */
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

  /**
   * Trouve une mission par son ID
   * @param {number} id - ID de la mission
   * @returns {Promise<object|null>} La mission trouvée ou null si inexistante
   */
  async findById(id) {
    const [[m]] = await pool.query("SELECT * FROM missions WHERE id=?", [id]);
    return m || null;
  }

  /**
   * Supprime une mission
   * @param {number} id - ID de la mission
   * @returns {Promise<boolean>} true si supprimée, false sinon
   */
  async remove(id) {
    const [r] = await pool.query("DELETE FROM missions WHERE id=?", [id]);
    return r.affectedRows > 0;
  }

  /**
   * Met à jour une mission
   * @param {number} id - ID de la mission
   * @param {string} title - Nouveau titre
   * @param {string} description - Nouvelle description
   * @param {string} date - Nouvelle date
   * @returns {Promise<object>} La mission mise à jour
   */
  async update(id, title, description, date) {
    await pool.query(
      "UPDATE missions SET title=?, description=?, date=? WHERE id=?",
      [title, description, date, id]
    );
    const [[m]] = await pool.query("SELECT * FROM missions WHERE id=?", [id]);
    return m;
  }
}
