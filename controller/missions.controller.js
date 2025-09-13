import { MissionService } from "../services/missions.services.js";
import { ApplicationsService } from "../services/applications.services.js";

const missionService = new MissionService();
const appsService = new ApplicationsService();

/**
 * Contrôleur des missions
 * Gère la création, la suppression, la mise à jour et la consultation des missions.
 */
export class MissionController {
  /**
   * POST /missions
   * @summary Crée une mission (association uniquement)
   * @param {import('express').Request} req - body: { title:string, description:string, date:string }
   * @param {import('express').Response} res
   * @returns {Promise<void>} 201 si créée, 400 si champs manquants, 401 si non authentifié
   */
  async create(req, res) {
    try {
      const { title, description, date } = req.body;
      if (!title || !description || !date) {
        return res.status(400).json({ message: "Champs manquants" });
      }

      if (!req.user?.id) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const mission = await missionService.create({
        title,
        description,
        date,
        associationId: req.user.id,
      });
      res.status(201).json(mission);
    } catch (err) {
      console.error("Erreur create mission:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  /**
   * GET /missions
   * @summary Liste toutes les missions disponibles
   * @param {import('express').Request} _req
   * @param {import('express').Response} res
   * @returns {Promise<void>} 200 avec la liste
   */
  async list(_req, res) {
    try {
      const missions = await missionService.list();
      res.json(missions);
    } catch (err) {
      console.error("Erreur list missions:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  /**
   * GET /missions/:id/applications
   * @summary Liste les candidatures en attente pour une mission (côté asso)
   * @param {import('express').Request} req - params: { id:number }
   * @param {import('express').Response} res
   * @returns {Promise<void>} 200 avec la liste, 404 si aucune candidature
   */
  async listForMissionPending(req, res) {
    try {
      const missionId = req.params.id;
      const apps = await appsService.forMission(missionId);
      if (!apps.length) {
        return res.status(404).json({ message: "Aucune candidature trouvée" });
      }
      const onlyPending = apps.filter((a) => a.status === "PENDING");
      res.json(onlyPending);
    } catch (err) {
      console.error("Erreur listForMissionPending:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  /**
   * DELETE /missions/:id
   * @summary Supprime une mission (association uniquement)
   * @param {import('express').Request} req - params: { id:number }
   * @param {import('express').Response} res
   * @returns {Promise<void>} 200 si supprimée, 400 si id invalide, 403 si non autorisé
   */
  async remove(req, res) {
    try {
      const missionId = Number(req.params.id);
      if (!missionId) {
        return res.status(400).json({ message: "Id invalide" });
      }

      const ok = await missionService.delete(missionId, req.user.id);
      if (!ok) {
        return res.status(403).json({ message: "Non autorisé" });
      }

      res.json({ message: "Mission supprimée" });
    } catch (err) {
      console.error("Erreur remove mission:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  /**
   * PUT /missions/:id
   * @summary Met à jour une mission (association uniquement)
   * @param {import('express').Request} req - params: { id:number }, body: { title, description, date }
   * @param {import('express').Response} res
   * @returns {Promise<void>} 200 si mise à jour, 400 si id invalide, 403 si non autorisé
   */
  async update(req, res) {
    try {
      const missionId = Number(req.params.id);
      if (!missionId) {
        return res.status(400).json({ message: "Id invalide" });
      }

      const updated = await missionService.update(
        missionId,
        req.user.id,
        req.body
      );
      if (!updated) {
        return res.status(403).json({ message: "Non autorisé" });
      }

      res.json({ message: "Mission mise à jour" });
    } catch (err) {
      console.error("Erreur update mission:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
}
