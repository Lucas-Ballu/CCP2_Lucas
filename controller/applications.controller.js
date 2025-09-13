import { ApplicationsService } from "../services/applications.services.js";

const service = new ApplicationsService();

/**
 * Controller des candidatures (applications).
 * Expose des endpoints pour postuler, lister mes candidatures,
 * lister les candidatures d'une mission et changer le statut.
 */
export class ApplicationsController {
  /**
   * POST /applications
   * @summary Un bénévole postule à une mission
   * @param {import('express').Request} req - body: { missionId:number, note?:string }
   * @param {import('express').Response} res
   * @returns {Promise<void>} 201 si OK, 400 si missionId manquant, 409 si déjà postulé
   */
  async apply(req, res) {
    const { missionId, note } = req.body;
    if (!missionId)
      return res.status(400).json({ message: "missionId requis" });

    const a = await service.apply(missionId, req.user.id, note);
    res.status(201).json(a);
  }

  /**
   * GET /applications/myApplications
   * @summary Retourne les candidatures du bénévole connecté
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>} 200 avec la liste
   */
  async myApplications(req, res) {
    const rows = await service.myApplications(req.user.id);
    res.json(rows);
  }

  /**
   * GET /missions/:id/applications
   * @summary Retourne les candidatures d'une mission (côté asso)
   * @param {import('express').Request} req - params: { id:number }
   * @param {import('express').Response} res
   * @returns {Promise<void>} 200 avec la liste, 404 si aucune
   */
  async forMission(req, res) {
    const rows = await service.forMission(req.params.id);
    res.json(rows);
  }

  /**
   * PATCH /applications/:id/status
   * @summary Modifie le statut d'une candidature (ACCEPTED/REJECTED)
   * @param {import('express').Request} req - params: { id:number }, body: { status:string }
   * @param {import('express').Response} res
   * @returns {Promise<void>} 200 avec la candidature MAJ, 400 si status manquant
   */
  async setStatus(req, res) {
    const { status } = req.body;
    const a = await service.setStatus(req.params.id, status);
    res.json(a);
  }
}
