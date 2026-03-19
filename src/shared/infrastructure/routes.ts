import { Express } from "express";
import { drawRouter } from "../../contexts/draw/presentation/draw.router.js";
import { matchesRouter } from "../../contexts/matches/presentation/matches.router.js";

export function registerRoutes(app: Express): void {
  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      service: "champions-league-draw-api",
      timestamp: new Date().toISOString(),
    });
  });

  app.use(drawRouter);
  app.use(matchesRouter);
}
