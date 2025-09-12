import { ApplicationsService } from "../services/applications.services.js";

const service = new ApplicationsService();

export class ApplicationsController {
  async apply(req, res) {
    try {
      const { missionId, note } = req.body;
      if (!missionId) {
        return res.status(400).json({ message: "missionId requis" });
      }

      const a = await service.apply(missionId, req.user.id, note);
      res.status(201).json(a);
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ message: "Vous avez déjà postulé à cette mission" });
      }
      console.error("Erreur apply:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  async myApplications(req, res) {
    try {
      const rows = await service.myApplications(req.user.id);
      res.json(rows);
    } catch (err) {
      console.error("Erreur myApplications:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  async forMission(req, res) {
    try {
      const rows = await service.forMission(req.params.id);
      if (!rows.length) {
        return res
          .status(404)
          .json({ message: "Aucune candidature trouvée pour cette mission" });
      }
      res.json(rows);
    } catch (err) {
      console.error("Erreur forMission:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  async setStatus(req, res) {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "status requis" });
      }

      const a = await service.setStatus(req.params.id, status);
      res.json(a);
    } catch (err) {
      console.error("Erreur setStatus:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
}
