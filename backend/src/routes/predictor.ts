import { Router } from "express";
import { predictColleges } from "../controllers/predictorController";

const router = Router();

router.get("/", predictColleges);

export default router;
