import { MissionService } from "../services/missions.services.js";
import { ApplicationsService } from "../services/applications.services.js";

const appsService = new ApplicationsService();
const missionService = new MissionService();

export class MissionController {
  async create(req, res) {
    const { title, description, date } = req.body;
    if (!title || !description || !date)
      return res.status(400).json({ message: "Missing fields" });

    const associationId = req.user?.id;
    if (!associationId)
      return res.status(401).json({ message: "Not authenticated" });

    const mission = await missionService.create({
      title,
      description,
      date,
      associationId,
    });
    res.status(201).json(mission);
  }

  async list(_req, res) {
    const missions = await missionService.list();
    res.json(missions);
  }

  async listForMissionPending(req, res) {
    const missionId = req.params.id;
    const apps = await appsService.listForMissionPending(missionId);
    const onlyPending = apps.filter((a) => a.status === "PENDING");
    res.json(onlyPending);
  }

  async remove(req, res) {
    try {
      const missionId = Number(req.params.id);
      if (!missionId) {
        return res.status(400).json({ message: "Invalid id" });
      }
      await missionService.delete(missionId, req.user.id);
      res.status(200).json({ message: "Mission supprimée" });
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  }

  async update(req, res) {
    try {
      const missionId = Number(req.params.id);
      if (!missionId) return res.status(400).json({ message: "Invalid id" });

      await missionService.update(missionId, req.user.id, req.body);

      res.status(200).json({ message: "Mission mise à jour" });
    } catch (e) {
      console.error(" Erreur update mission:", e);
      res.status(500).json({ message: "Server error" });
    }
  }
}
