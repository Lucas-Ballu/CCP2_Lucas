import { MissionRepository } from "../repository/missions.repository.js";
const missionRepo = new MissionRepository();

/**
 * Service des missions
 * Gère la logique métier entre les controllers et le repository
 */
export class MissionService {
  /**
   * Crée une nouvelle mission
   * @param {{ title:string, description:string, date:string, associationId:number }} data - Données de la mission
   * @returns {Promise<object>} La mission créée
   */
  async create({ title, description, date, associationId }) {
    return missionRepo.create(title, description, date, associationId);
  }

  /**
   * Récupère toutes les missions
   * @returns {Promise<object[]>} Liste des missions
   */
  async list() {
    return missionRepo.list();
  }

  /**
   * Récupère les candidatures en attente d'une mission
   * @param {number} missionId - ID de la mission
   * @returns {Promise<object[]>} Liste des candidatures en attente
   */
  listForMissionPending(missionId) {
    return missionRepo.listForMissionPending(missionId);
  }

  /**
   * Supprime une mission (uniquement si elle appartient à l'association connectée)
   * @param {number} missionId - ID de la mission
   * @param {number} requesterId - ID de l'utilisateur connecté (association)
   * @returns {Promise<boolean|null>} true si supprimée, false si non autorisé, null si introuvable
   */
  async delete(missionId, requesterId) {
    const m = await missionRepo.findById(missionId);
    if (!m) return null;
    if (m.association_id !== requesterId) return false;
    await missionRepo.remove(missionId);
    return true;
  }

  /**
   * Met à jour une mission (uniquement si elle appartient à l'association connectée)
   * @param {number} missionId - ID de la mission
   * @param {number} requesterId - ID de l'utilisateur connecté
   * @param {{ title:string, description:string, date:string }} data - Nouvelles données
   * @returns {Promise<object|boolean|null>} Mission mise à jour, false si non autorisé, null si introuvable
   */
  async update(missionId, requesterId, data) {
    const m = await missionRepo.findById(missionId);
    if (!m) return null;
    if (Number(m.association_id) !== Number(requesterId)) return false;

    return missionRepo.update(
      missionId,
      data.title,
      data.description,
      data.date
    );
  }
}
