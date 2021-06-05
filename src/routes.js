import express from "express";
const { Router } = express;

import authMiddleware from "./app/middlewares/authMiddleware.js";

import UserController from "./app/controllers/UserController.js";
import SessionController from "./app/controllers/SessionController.js";
import ForgotPasswordController from "./app/controllers/ForgotPasswordController.js";

const routes = Router();

routes.post("/users", UserController.store);
routes.post("/passwords", ForgotPasswordController.store);
routes.put("/passwords", ForgotPasswordController.update);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.get("/users/findall", UserController.index);
routes.get("/users", UserController.show);
routes.put("/users", UserController.update);
routes.delete("/users", UserController.destroy);

export default routes;
