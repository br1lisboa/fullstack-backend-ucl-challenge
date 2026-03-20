import { z } from "zod";

export const SearchMatchesQuerySchema = z.object({
  teamId: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return val.split(",").map((v) => parseInt(v.trim(), 10));
    })
    .refine(
      (val) => val === undefined || val.every((v) => !isNaN(v) && v > 0),
      { message: "Team ID must be greater than 0" }
    ),
  matchDay: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || (val >= 1 && val <= 8), {
      message: "Match day must be between 1 and 8",
    }),
  matchDayFrom: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || (val >= 1 && val <= 8), {
      message: "matchDayFrom must be between 1 and 8",
    }),
  matchDayTo: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || (val >= 1 && val <= 8), {
      message: "matchDayTo must be between 1 and 8",
    }),
  countryId: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return val.split(",").map((v) => parseInt(v.trim(), 10));
    })
    .refine(
      (val) => val === undefined || val.every((v) => !isNaN(v) && v > 0),
      { message: "Country ID must be greater than 0" }
    ),
  sortBy: z
    .enum(["matchDay", "homeTeam", "awayTeam", "id"])
    .optional()
    .default("matchDay"),
  sortOrder: z
    .enum(["asc", "desc"])
    .optional()
    .default("asc"),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, {
      message: "Page must be greater than 0",
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val >= 1 && val <= 100, {
      message: "Limit must be between 1 and 100",
    }),
});

export type SearchMatchesQuery = z.infer<typeof SearchMatchesQuerySchema>;
