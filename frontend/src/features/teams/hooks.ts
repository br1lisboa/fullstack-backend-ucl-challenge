"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "./api";

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    staleTime: Infinity,
  });
}
