import { ApplicationsRepository } from "../repository/applications.repository.js";

const repo = new ApplicationsRepository();

/**
 * Service des candidatures (applications)
 * Contient la logique métier entre les controllers et le repository
 */
export class ApplicationsService {
  /**
   * Crée une nouvelle candidature pour une mission
   * @param {number} missionId - ID de la mission
   * @param {number} volunteerId - ID du bénévole
   * @param {string} [note] - Note optionnelle du bénévole
   * @returns {Promise<object>} La candidature créée
   */
  apply(missionId, volunteerId, note) {
    return repo.create(missionId, volunteerId, note);
  }

  /**
   * Récupère les candidatures du bénévole connecté
   * @param {number} volunteerId - ID du bénévole
   * @returns {Promise<object[]>} Liste des candidatures
   */
  myApplications(volunteerId) {
    return repo.myApplications(volunteerId);
  }

  /**
   * Récupère les candidatures d'une mission
   * @param {number} missionId - ID de la mission
   * @returns {Promise<object[]>} Liste des candidatures
   */
  forMission(missionId) {
    return repo.listForMission(missionId);
  }

  /**
   * Récupère les candidatures en attente d'une mission
   * @param {number} missionId - ID de la mission
   * @returns {Promise<object[]>} Liste des candidatures en attente
   */
  listForMissionPending(missionId) {
    return repo.listForMissionPending(missionId);
  }

  /**
   * Modifie le statut d'une candidature (ACCEPTED / REJECTED)
   * @param {number} id - ID de la candidature
   * @param {string} status - Nouveau statut
   * @returns {Promise<object>} La candidature mise à jour
   */
  setStatus(id, status) {
    return repo.setStatus(id, status);
  }
}
