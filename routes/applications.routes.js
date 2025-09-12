import Router from "express";
import auth from "../middlewares/auth.middleware.js";
import { ApplicationsController } from "../controller/applications.controller.js";
import { authorizeRole } from "../middlewares/roles.middleware.js";

const appRouter = Router();
const appCtrl = new ApplicationsController();

appRouter.post(
  "/applications",
  auth,
  authorizeRole(["VOLUNTEER"]),
  (req, res) => appCtrl.apply(req, res)
);

appRouter.get("/applications/myApplications", auth, (req, res) =>
  appCtrl.myApplications(req, res)
);

appRouter.get("/missions/:id/applications", auth, (req, res) =>
  appCtrl.forMission(req, res)
);

appRouter.patch(
  "/applications/:id/status",
  auth,
  authorizeRole(["ASSOCIATION"]),
  (req, res) => appCtrl.setStatus(req, res)
);

export default appRouter;
