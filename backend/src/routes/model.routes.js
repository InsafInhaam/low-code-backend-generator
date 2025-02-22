import express from "express";
import { authenticateUser, authorizeRole } from "../middleware/auth.middleware.js";
import { createModel, deleteModel, getAllModels, getModelById } from "../controllers/model.controller.js";

const router = express.Router();

// Only authenticated users can access these routes
router.get("/models", authenticateUser, getAllModels);
router.post("/models", authenticateUser, authorizeRole("admin"), createModel);
router.get("/models/:id", authenticateUser, getModelById);
router.delete("/models/:id", authenticateUser, authorizeRole("admin"), deleteModel);

export default router;
