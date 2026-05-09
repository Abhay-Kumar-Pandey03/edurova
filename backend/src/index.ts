import "dotenv/config";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import collegesRouter from "./routes/colleges";
import compareRouter from "./routes/compare";
import predictorRouter from "./routes/predictor";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/colleges", collegesRouter);
app.use("/api/compare", compareRouter);
app.use("/api/predict", predictorRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
