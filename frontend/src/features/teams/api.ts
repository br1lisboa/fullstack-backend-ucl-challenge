import { apiFetch } from "@/shared/api-client";
import type { Team, Match } from "@/shared/types";

export interface TeamDetail {
  team: Team;
  matches: Match[];
}

export function fetchTeams(): Promise<Team[]> {
  return apiFetch<Team[]>("/teams");
}

export function fetchTeamById(id: number): Promise<TeamDetail> {
  return apiFetch<TeamDetail>(`/teams/${id}`);
}
