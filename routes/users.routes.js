import Router from "express";
import { AuthController } from "../controller/users.controller.js";

const userRoutes = Router();
const authCtrl = new AuthController();

/**
 * @route POST /register
 * @summary Inscription d'un nouvel utilisateur (bénévole ou association)
 * @body { role:string, email:string, password:string, name:string }
 */
userRoutes.post("/register", (req, res) => authCtrl.register(req, res));

/**
 * @route POST /login
 * @summary Connexion d'un utilisateur et création d'un token JWT en cookie
 * @body { email:string, password:string }
 */
userRoutes.post("/login", (req, res) => authCtrl.login(req, res));

/**
 * @route POST /logout
 * @summary Déconnexion de l'utilisateur (suppression du cookie JWT)
 */
userRoutes.post("/logout", (req, res) => authCtrl.logout(req, res));

export default userRoutes;
