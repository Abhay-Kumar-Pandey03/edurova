import { Request, Response } from "express";
import prisma from "../prisma/client";

export const compareColleges = async (req: Request, res: Response): Promise<void> => {
  try {
    const idsQuery = typeof req.query.ids === "string" ? req.query.ids : "";

    if (!idsQuery) {
      res.status(400).json({ error: "ids query param is required" });
      return;
    }

    const parsedIds = idsQuery
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => Number.isInteger(id) && id > 0);

    const uniqueIds = Array.from(new Set(parsedIds));

    if (!uniqueIds.length) {
      res.status(400).json({ error: "No valid college IDs provided" });
      return;
    }

    if (uniqueIds.length > 3) {
      res.status(400).json({ error: "Maximum 3 colleges can be compared" });
      return;
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: uniqueIds } }
    });

    res.json(colleges);
  } catch (error) {
    res.status(500).json({ error: "Failed to compare colleges" });
  }
};
