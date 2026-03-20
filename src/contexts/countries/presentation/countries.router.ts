import { Router, Request, Response, NextFunction } from "express";
import { container } from "../../../shared/container/container.js";
import { TYPES } from "../../../shared/container/types.js";
import { SearchCountriesService } from "../application/search-countries.service.js";

export const countriesRouter = Router();

countriesRouter.get(
  "/countries",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const service = container.get<SearchCountriesService>(TYPES.SearchCountriesService);
      const countries = await service.run();
      return res.status(200).json(countries);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }
);
