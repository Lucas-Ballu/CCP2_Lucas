import Router from "express";
import auth from "../middlewares/auth.middleware.js";
import { MissionController } from "../controller/missions.controller.js";
import { authorizeRole } from "../middlewares/roles.middleware.js";

const missionRouter = Router();
const missionCtrl = new MissionController();

missionRouter.post(
  "/missions",
  auth,
  authorizeRole(["ASSOCIATION"]),
  (req, res) => missionCtrl.create(req, res)
);

missionRouter.get("/missions", (req, res) => missionCtrl.list(req, res));

missionRouter.delete(
  "/missions/:id",
  auth,
  authorizeRole(["ASSOCIATION"]),
  (req, res) => missionCtrl.remove(req, res)
);

missionRouter.put(
  "/missions/:id",
  auth,
  authorizeRole(["ASSOCIATION"]),
  (req, res) => missionCtrl.update(req, res)
);

export default missionRouter;
