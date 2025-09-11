import { ApplicationsRepository } from "../repository/applications.repository.js";

const repo = new ApplicationsRepository();

export class ApplicationsService {
  apply(missionId, volunteerId, note) {
    return repo.create(missionId, volunteerId, note);
  }

  myApplications(volunteerId) {
    return repo.myApplications(volunteerId);
  }

  forMission(missionId) {
    return repo.listForMission(missionId);
  }

  setStatus(id, status) {
    return repo.setStatus(id, status);
  }
}
