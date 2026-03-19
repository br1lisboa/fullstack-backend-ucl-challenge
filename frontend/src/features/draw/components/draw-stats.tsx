"use client";

import { useDrawStatistics } from "../hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/shared/api-client";

export function DrawStats() {
  const { data: stats, isLoading, error } = useDrawStatistics();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error instanceof ApiError && error.status === 404) {
    return (
      <p className="text-sm text-muted-foreground">
        No draw exists yet. Execute a draw to see statistics.
      </p>
    );
  }

  if (!stats) return null;

  const cards = [
    { title: "Total Matches", value: stats.totalMatches },
    { title: "Teams", value: stats.totalTeams },
    { title: "Match Days", value: stats.matchDays },
    { title: "Countries", value: stats.countriesDistribution.length },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
