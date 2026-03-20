import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { container } from "../../../shared/container/container.js";
import { TYPES } from "../../../shared/container/types.js";
import { SearchTeamsService } from "../application/search-teams.service.js";
import { SearchTeamByIdService } from "../application/search-team-by-id.service.js";

const TeamIdSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive()),
});

const SearchTeamsQuerySchema = z.object({
  name: z.string().optional(),
});

export const teamsRouter = Router();

teamsRouter.get(
  "/teams",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = SearchTeamsQuerySchema.parse(req.query);
      const service = container.get<SearchTeamsService>(TYPES.SearchTeamsService);
      const teams = await service.run(query);
      return res.status(200).json(teams);
    } catch (error) {
      next(error);
    }
  }
);

teamsRouter.get(
  "/teams/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = TeamIdSchema.safeParse(req.params);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid team ID" });
      }

      const service = container.get<SearchTeamByIdService>(TYPES.SearchTeamByIdService);
      const result = await service.run(parsed.data.id);

      if (!result) {
        return res.status(404).json({ message: "Team not found" });
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);
