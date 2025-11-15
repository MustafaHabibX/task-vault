import express from "express";
import * as authController from "../controllers/auth-controller.js";
import { validateRegister } from "../middlewares/validate-register.js";

const router = express.Router();

router.get("/register", authController.showRegisterForm);

router.post("/register", validateRegister, authController.registerUser);

export default router;
