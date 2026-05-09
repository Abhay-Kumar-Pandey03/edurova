import { Request, Response } from "express";
import prisma from "../prisma/client";

const ALLOWED_EXAMS = ["JEE", "NEET"];

export const predictColleges = async (req: Request, res: Response): Promise<void> => {
  try {
    const exam = typeof req.query.exam === "string" ? req.query.exam.toUpperCase() : "";

    if (!ALLOWED_EXAMS.includes(exam)) {
      res.status(400).json({ error: "Invalid exam. Use JEE or NEET" });
      return;
    }

    const rank = parseInt(String(req.query.rank), 10);

    if (isNaN(rank) || rank <= 0) {
      res.status(400).json({ error: "Invalid rank" });
      return;
    }

    console.log("Predicting for exam:", exam, "rank:", rank);

    const colleges = await prisma.college.findMany({
      where: {
        exam_accepted: exam,
        min_rank: { lte: rank },
        max_rank: { gte: rank }
      },
      orderBy: { rating: "desc" }
    });

    res.json(colleges);
  } catch (error) {
    res.status(500).json({ error: "Failed to predict colleges" });
  }
};
