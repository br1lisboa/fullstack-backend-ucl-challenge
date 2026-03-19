import { MatchEntity } from "./match.entity";

export interface MatchFilters {
  teamId?: number;
  matchDay?: number;
  matchDayFrom?: number;
  matchDayTo?: number;
  countryId?: number;
}

export interface SortParams {
  sortBy: "matchDay" | "homeTeam" | "awayTeam" | "id";
  sortOrder: "asc" | "desc";
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedMatches {
  matches: MatchEntity[];
  total: number;
}

export interface MatchRepository {
  findAll(
    filters: MatchFilters,
    pagination: PaginationParams,
    sort?: SortParams
  ): Promise<PaginatedMatches>;
  findById(id: number): Promise<MatchEntity | null>;
}
