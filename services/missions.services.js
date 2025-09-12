import { MissionRepository } from "../repository/missions.repository.js";
const missionRepo = new MissionRepository();

export class MissionService {
  async create({ title, description, date, associationId }) {
    return missionRepo.create(title, description, date, associationId);
  }
  async list() {
    return missionRepo.list();
  }

  listForMissionPending(missionId) {
    return missionRepo.listForMissionPending(missionId);
  }

  async delete(missionId, requesterId) {
    const m = await missionRepo.findById(missionId);
    if (!m) return null;
    if (m.association_id !== requesterId) return false;
    await missionRepo.remove(missionId);
    return true;
  }

  async update(missionId, requesterId, data) {
    const m = await missionRepo.findById(missionId);
    if (!m) return null;
    if (Number(m.association_id) !== Number(requesterId)) return false;

    return missionRepo.update(
      missionId,
      data.title,
      data.description,
      data.date
    );
  }
}
