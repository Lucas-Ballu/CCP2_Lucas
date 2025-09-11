import { MissionService } from "../services/missions.services.js";

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
}
