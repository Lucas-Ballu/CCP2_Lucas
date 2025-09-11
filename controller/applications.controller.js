import { ApplicationsService } from "../services/applications.services.js";

const service = new ApplicationsService();

export class ApplicationsController {
  async apply(req, res) {
    const { missionId, note } = req.body;
    if (!missionId)
      return res.status(400).json({ message: "missionId requis" });

    const a = await service.apply(missionId, req.user.id, note);
    res.status(201).json(a);
  }

  async mine(req, res) {
    const rows = await service.mine(req.user.id);
    res.json(rows);
  }

  async forMission(req, res) {
    const rows = await service.forMission(req.params.id);
    res.json(rows);
  }

  async setStatus(req, res) {
    const { status } = req.body;
    const a = await service.setStatus(req.params.id, status);
    res.json(a);
  }
}
