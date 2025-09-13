import Router from "express";
import auth from "../middlewares/auth.middleware.js";
import { ApplicationsController } from "../controller/applications.controller.js";
import { authorizeRole } from "../middlewares/roles.middleware.js";

const appRouter = Router();
const appCtrl = new ApplicationsController();

/**
 * @route POST /applications
 * @summary Un bénévole postule à une mission
 * @middleware auth, authorizeRole("VOLUNTEER")
 */
appRouter.post(
  "/applications",
  auth,
  authorizeRole(["VOLUNTEER"]),
  (req, res) => appCtrl.apply(req, res)
);

/**
 * @route GET /applications/myApplications
 * @summary Retourne les candidatures du bénévole connecté
 * @middleware auth
 */
appRouter.get("/applications/myApplications", auth, (req, res) =>
  appCtrl.myApplications(req, res)
);

/**
 * @route GET /missions/:id/applications
 * @summary Retourne les candidatures d'une mission
 * @middleware auth
 */
appRouter.get("/missions/:id/applications", auth, (req, res) =>
  appCtrl.forMission(req, res)
);

/**
 * @route PATCH /applications/:id/status
 * @summary Modifie le statut d'une candidature (ACCEPTED / REJECTED)
 * @middleware auth, authorizeRole("ASSOCIATION")
 */
appRouter.patch(
  "/applications/:id/status",
  auth,
  authorizeRole(["ASSOCIATION"]),
  (req, res) => appCtrl.setStatus(req, res)
);

export default appRouter;
