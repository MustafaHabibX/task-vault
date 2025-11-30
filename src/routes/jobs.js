import express from "express";
import { authenticateJWT } from "../middlewares/validate-jwt.js";
import * as jobController from "../controllers/job-controller.js";

const router = express.Router();

// * Jobs *******************************************************************

// * All Jobs ***********
router.get("/", authenticateJWT, jobController.getJobs);

// * Create a new Jobs
router.post("/", authenticateJWT, jobController.createJob);

// * Get the details of a specific job
router.get("/:id", authenticateJWT, jobController.getSpecificJob);

export default router;
