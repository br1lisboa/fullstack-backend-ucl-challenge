import { Router, Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { container } from "../../../shared/container/container.js";
import { TYPES } from "../../../shared/container/types.js";
import { SearchMatchesService } from "../application/search-matches.service.js";
import { SearchMatchesResponse } from "./dtos/match-response.dto.js";
import { SearchMatchesQuerySchema } from "./dtos/search-matches.dto.js";
import { MatchRepository } from "../domain/match.repository.js";
import { logger } from "../../../shared/infrastructure/logger.js";

const MatchIdSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive()),
});

export const matchesRouter = Router();

matchesRouter.get(
  "/matches",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = SearchMatchesQuerySchema.parse(req.query);

      const searchMatchesService = container.get<SearchMatchesService>(
        TYPES.SearchMatchesService
      );

      const result: SearchMatchesResponse = await searchMatchesService.run({
        teamId: parsed.teamId,
        side: parsed.side,
        matchDay: parsed.matchDay,
        matchDayFrom: parsed.matchDayFrom,
        matchDayTo: parsed.matchDayTo,
        countryId: parsed.countryId,
        sortBy: parsed.sortBy,
        sortOrder: parsed.sortOrder,
        page: parsed.page,
        limit: parsed.limit,
      });

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn({ query: req.query, issue: error.issues[0].message }, "Invalid match query params");
        return res.status(400).json({ message: error.issues[0].message });
      }
      if (error instanceof Error) {
        logger.error({ err: error }, "Failed to search matches");
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }
);

matchesRouter.get(
  "/matches/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = MatchIdSchema.safeParse(req.params);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid match ID" });
      }

      const matchRepository = container.get<MatchRepository>(TYPES.MatchRepository);
      const match = await matchRepository.findById(parsed.data.id);

      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }

      return res.status(200).json(match.toPrimitives());
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }
);
