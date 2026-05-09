import { Request, Response } from "express";
import prisma from "../prisma/client";

const PAGE_SIZE = 12;

export const getColleges = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const location = typeof req.query.location === "string" ? req.query.location.trim() : "";
    const course = typeof req.query.course === "string" ? req.query.course.trim() : "";
    const exam = typeof req.query.exam === "string" ? req.query.exam.trim() : "";
    const minFees = req.query.minFees ? Number(req.query.minFees) : undefined;
    const maxFees = req.query.maxFees ? Number(req.query.maxFees) : undefined;

    if ((minFees !== undefined && Number.isNaN(minFees)) || (maxFees !== undefined && Number.isNaN(maxFees))) {
      res.status(400).json({ error: "Invalid fees filters" });
      return;
    }

    const andFilters: Record<string, unknown>[] = [];

    if (search) {
      andFilters.push({ name: { contains: search, mode: "insensitive" } });
    }
    if (location) {
      andFilters.push({
        OR: [
          { state: { contains: location, mode: "insensitive" } },
          { location: { contains: location, mode: "insensitive" } },
        ],
      });
    }
    if (course) {
      andFilters.push({ courses: { has: course } });
    }
    if (exam) {
      andFilters.push({ exam_accepted: exam });
    }
    if (minFees !== undefined || maxFees !== undefined) {
      andFilters.push({
        fees: {
          ...(minFees !== undefined ? { gte: minFees } : {}),
          ...(maxFees !== undefined ? { lte: maxFees } : {}),
        },
      });
    }

    const where = andFilters.length ? { AND: andFilters } : {};
    const skip = (page - 1) * PAGE_SIZE;

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        orderBy: { rating: "desc" },
      }),
      prisma.college.count({ where }),
    ]);

    res.json({
      data: colleges,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
};

export const getCollegeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "Invalid college ID" });
      return;
    }

    const college = await prisma.college.findUnique({ where: { id } });

    if (!college) {
      res.status(404).json({ error: "College not found" });
      return;
    }

    res.json(college);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch college" });
  }
};

// ✅ NEW: Real stats from database
export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [totalColleges, statesResult, avgPlacement, topRating] = await Promise.all([
      prisma.college.count(),
      prisma.college.findMany({
        select: { state: true },
        distinct: ["state"],
      }),
      prisma.college.aggregate({
        _avg: { placement_percent: true },
      }),
      prisma.college.aggregate({
        _max: { rating: true },
      }),
    ]);

    res.json({
      totalColleges,
      totalStates: statesResult.length,
      avgPlacement: Math.round(avgPlacement._avg.placement_percent || 0),
      topRating: topRating._max.rating || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
