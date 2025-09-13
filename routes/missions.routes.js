import Router from "express";
import auth from "../middlewares/auth.middleware.js";
import { MissionController } from "../controller/missions.controller.js";
import { authorizeRole } from "../middlewares/roles.middleware.js";

const missionRouter = Router();
const missionCtrl = new MissionController();

/**
 * @route POST /missions
 * @summary Crée une nouvelle mission (réservé aux associations)
 * @middleware auth, authorizeRole("ASSOCIATION")
 */
missionRouter.post(
  "/missions",
  auth,
  authorizeRole(["ASSOCIATION"]),
  (req, res) => missionCtrl.create(req, res)
);

/**
 * @route GET /missions
 * @summary Récupère toutes les missions disponibles
 */
missionRouter.get("/missions", (req, res) => missionCtrl.list(req, res));

/**
 * @route DELETE /missions/:id
 * @summary Supprime une mission (réservé à l'association propriétaire)
 * @middleware auth, authorizeRole("ASSOCIATION")
 */
missionRouter.delete(
  "/missions/:id",
  auth,
  authorizeRole(["ASSOCIATION"]),
  (req, res) => missionCtrl.remove(req, res)
);

/**
 * @route PUT /missions/:id
 * @summary Met à jour une mission (réservé à l'association propriétaire)
 * @middleware auth, authorizeRole("ASSOCIATION")
 */
missionRouter.put(
  "/missions/:id",
  auth,
  authorizeRole(["ASSOCIATION"]),
  (req, res) => missionCtrl.update(req, res)
);

/**
 * @route GET /missions/:id/applications
 * @summary Récupère les candidatures en attente d'une mission (côté association)
 * @middleware auth, authorizeRole("ASSOCIATION")
 */
missionRouter.get(
  "/missions/:id/applications",
  auth,
  authorizeRole(["ASSOCIATION"]),
  (req, res) => missionCtrl.listForMissionPending(req, res)
);

export default missionRouter;
