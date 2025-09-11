import Router from "express";
import auth from "../middlewares/auth.middleware.js";
import { MissionController } from "../controller/missions.controller.js";

const missionRouter = Router();
const missionCtrl = new MissionController();

missionRouter.post("/missions", auth, (req, res) =>
  missionCtrl.create(req, res)
);

missionRouter.get("/missions", (req, res) => missionCtrl.list(req, res));

export default missionRouter;
