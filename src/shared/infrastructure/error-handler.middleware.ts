import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { DomainError } from "../domain/domain-error.js";
import { logger } from "./logger.js";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof DomainError) {
    logger.warn({ err: error }, error.message);
    res.status(error.httpStatus).json({ message: error.message });
    return;
  }

  if (error instanceof ZodError) {
    logger.warn({ issues: error.issues }, "Validation error");
    res.status(400).json({ message: error.issues[0].message });
    return;
  }

  if (error instanceof Error) {
    logger.error({ err: error }, "Unexpected error");
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  logger.error({ err: error }, "Unknown error");
  res.status(500).json({ message: "Internal server error" });
}
