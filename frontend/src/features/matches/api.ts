import { apiFetch } from "@/shared/api-client";
import type { Match, PaginatedResponse } from "@/shared/types";

export interface MatchFilters {
  teamId?: number;
  matchDay?: number;
  matchDayFrom?: number;
  matchDayTo?: number;
  countryId?: number;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export function fetchMatches(
  filters: MatchFilters
): Promise<PaginatedResponse<Match>> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const qs = params.toString();
  return apiFetch<PaginatedResponse<Match>>(
    `/matches${qs ? `?${qs}` : ""}`
  );
}

export function fetchMatchById(id: string): Promise<Match> {
  return apiFetch<Match>(`/matches/${id}`);
}
