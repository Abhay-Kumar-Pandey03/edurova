import { Router } from "express";
import { compareColleges } from "../controllers/compareController";

const router = Router();

router.get("/", compareColleges);

export default router;
