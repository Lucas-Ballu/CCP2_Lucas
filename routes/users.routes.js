import Router from "express";
import { AuthController } from "../controller/users.controller.js";

const userRoutes = Router();
const authCtrl = new AuthController();

userRoutes.post("/register", (req, res) => authCtrl.register(req, res));
userRoutes.post("/login", (req, res) => authCtrl.login(req, res));
userRoutes.post("/logout", (req, res) => authCtrl.logout(req, res));

export default userRoutes;
