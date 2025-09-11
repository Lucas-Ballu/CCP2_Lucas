import { MissionRepository } from "../repository/missions.repository.js";
const missionRepo = new MissionRepository();

export class MissionService {
  async create({ title, description, date, associationId }) {
    return missionRepo.create(title, description, date, associationId);
  }
  async list() {
    return missionRepo.list();
  }
}
