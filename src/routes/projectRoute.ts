import express from "express";
import * as ProjectController from "../controllers/projectController";

const router = express.Router();

router.get("/", ProjectController.getProjects);

router.get("/:projectId", ProjectController.getProject);

router.post("/", ProjectController.createProject);

router.patch("/:projectId", ProjectController.updateProject);

router.delete("/:projectId", ProjectController.deleteProject);


export default router;
