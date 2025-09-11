import { MissionService } from "../services/missions.services";

const missionService = new MissionService();

export class MissionController {
  async list(_req, res) {
    res.json(await missionService.list());
  }

  async create(req, res) {
    const m = await missionService.create(req.body, req.user.sub);
    res.status(201).json(m);
  }
}
