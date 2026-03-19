import { apiFetch } from "@/shared/api-client";
import type { DrawStatistics } from "@/shared/types";

export interface DrawResponse {
  id: number;
  createdAt: string;
  pots: Array<{
    id: number;
    teams: Array<{ id: number; name: string; country: { id: number; name: string } }>;
  }>;
  matches: Array<{
    id: number;
    drawId: number;
    homeTeam: { id: number; name: string; country: { id: number; name: string } };
    awayTeam: { id: number; name: string; country: { id: number; name: string } };
    matchDay: number;
  }>;
}

export function fetchDraw(): Promise<DrawResponse> {
  return apiFetch<DrawResponse>("/draw");
}

export function createDraw(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/draw", { method: "POST" });
}

export function deleteDraw(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/draw", { method: "DELETE" });
}

export function fetchDrawStatistics(): Promise<DrawStatistics> {
  return apiFetch<DrawStatistics>("/draw/statistics");
}
