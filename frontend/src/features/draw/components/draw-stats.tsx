"use client";

import { useDrawStatistics } from "../hooks";
import { StatCards } from "@/shared/components/stat-cards";
import { EmptyState } from "@/shared/components/empty-state";
import { ApiError } from "@/shared/api-client";
import { useDictionary } from "@/i18n/context";

export function DrawStats() {
  const { data: stats, isLoading, error } = useDrawStatistics();
  const t = useDictionary();

  if (error instanceof ApiError && error.status === 404) {
    return <EmptyState message={t.draw.noDrawStats} />;
  }

  if (!stats && !isLoading) return null;

  return (
    <StatCards loading={isLoading}>
      <StatCards.Item title={t.draw.totalMatches} value={stats?.totalMatches ?? 0} />
      <StatCards.Item title={t.draw.totalTeams} value={stats?.totalTeams ?? 0} />
      <StatCards.Item title={t.draw.matchDays} value={stats?.matchDays ?? 0} />
      <StatCards.Item
        title={t.draw.countries}
        value={stats?.countriesDistribution.length ?? 0}
      />
    </StatCards>
  );
}
