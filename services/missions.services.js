import { MissionRepository } from "../repository/missions.repository";
const missionRepo = new MissionRepository();

export class MissionService {
  list() {
    return missionRepo.list();
  }

  create(data, userId) {
    return missionRepo.create(data.title, data.description, data.date, userId);
  }
}
