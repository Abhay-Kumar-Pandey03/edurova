import { Router } from "express";
import { getCollegeById, getColleges, getStats } from "../controllers/collegeController";

const router = Router();

// ✅ IMPORTANT: /stats must be BEFORE /:id to avoid conflict
router.get("/stats", getStats);
router.get("/", getColleges);
router.get("/:id", getCollegeById);

export default router;
