"use client";

import { useDrawStatistics } from "../hooks";
import { StatCards } from "@/shared/components/stat-cards";
import { EmptyState } from "@/shared/components/empty-state";
import { ApiError } from "@/shared/api-client";

export function DrawStats() {
  const { data: stats, isLoading, error } = useDrawStatistics();

  if (error instanceof ApiError && error.status === 404) {
    return (
      <EmptyState message="No draw exists yet. Execute a draw to see statistics." />
    );
  }

  if (!stats && !isLoading) return null;

  return (
    <StatCards loading={isLoading}>
      <StatCards.Item title="Total Matches" value={stats?.totalMatches ?? 0} />
      <StatCards.Item title="Teams" value={stats?.totalTeams ?? 0} />
      <StatCards.Item title="Match Days" value={stats?.matchDays ?? 0} />
      <StatCards.Item
        title="Countries"
        value={stats?.countriesDistribution.length ?? 0}
      />
    </StatCards>
  );
}
