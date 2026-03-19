"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDraw, createDraw, deleteDraw, fetchDrawStatistics } from "./api";
import { ApiError } from "@/shared/api-client";

export function useDraw() {
  return useQuery({
    queryKey: ["draw"],
    queryFn: fetchDraw,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) return false;
      return failureCount < 2;
    },
  });
}

export function useDrawStatistics() {
  return useQuery({
    queryKey: ["draw", "statistics"],
    queryFn: fetchDrawStatistics,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) return false;
      return failureCount < 2;
    },
  });
}

export function useCreateDraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDraw,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["draw"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}

export function useDeleteDraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDraw,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["draw"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}
