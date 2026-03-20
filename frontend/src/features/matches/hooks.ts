"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchMatches, type MatchFilters } from "./api";

export function useMatchFilters(): MatchFilters {
  const searchParams = useSearchParams();

  return {
    teamId: searchParams.get("teamId") || undefined,
    matchDay: searchParams.get("matchDay")
      ? Number(searchParams.get("matchDay"))
      : undefined,
    matchDayFrom: searchParams.get("matchDayFrom")
      ? Number(searchParams.get("matchDayFrom"))
      : undefined,
    matchDayTo: searchParams.get("matchDayTo")
      ? Number(searchParams.get("matchDayTo"))
      : undefined,
    countryId: searchParams.get("countryId") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    sortOrder: searchParams.get("sortOrder") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 20,
  };
}

export function useMatches(filters: MatchFilters) {
  return useQuery({
    queryKey: ["matches", filters],
    queryFn: () => fetchMatches(filters),
  });
}
