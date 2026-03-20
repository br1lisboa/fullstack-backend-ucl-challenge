"use client";

import type { Match } from "@/shared/types";
import { DataTable } from "@/shared/components/data-table";
import { TeamLabel } from "@/shared/components/team-label";
import { Badge } from "@/components/ui/badge";
import { useDictionary } from "@/i18n/context";

interface TeamMatchesTableProps {
  matches: Match[];
  teamId: number;
}

interface MatchWithVenue extends Match {
  opponent: Match["homeTeam"];
  isHome: boolean;
}

export function TeamMatchesTable({ matches, teamId }: TeamMatchesTableProps) {
  const t = useDictionary();

  const rows: MatchWithVenue[] = matches
    .toSorted((a, b) => a.matchDay - b.matchDay)
    .map((m) => {
      const isHome = m.homeTeam.id === teamId;
      return {
        ...m,
        opponent: isHome ? m.awayTeam : m.homeTeam,
        isHome,
      };
    });

  return (
    <DataTable<MatchWithVenue>
      data={rows}
      empty={t.teams.noMatches}
      keyExtractor={(m) => m.id}
    >
      <DataTable.Column<MatchWithVenue>
        header={t.teams.headerDay}
        className="w-16"
        render={(m) => <Badge variant="outline">{m.matchDay}</Badge>}
      />
      <DataTable.Column<MatchWithVenue>
        header={t.teams.headerOpponent}
        render={(m) => <TeamLabel team={m.opponent} />}
      />
      <DataTable.Column<MatchWithVenue>
        header={t.teams.headerVenue}
        className="w-20"
        render={(m) => (
          <Badge variant={m.isHome ? "default" : "secondary"}>
            {m.isHome ? t.teams.home : t.teams.away}
          </Badge>
        )}
      />
    </DataTable>
  );
}
