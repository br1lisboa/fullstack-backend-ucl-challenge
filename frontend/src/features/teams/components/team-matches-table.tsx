import type { Match } from "@/shared/types";
import { DataTable } from "@/shared/components/data-table";
import { TeamLabel } from "@/shared/components/team-label";
import { Badge } from "@/components/ui/badge";

interface TeamMatchesTableProps {
  matches: Match[];
  teamId: number;
}

interface MatchWithVenue extends Match {
  opponent: Match["homeTeam"];
  isHome: boolean;
}

export function TeamMatchesTable({ matches, teamId }: TeamMatchesTableProps) {
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
      empty="No matches yet. Execute a draw first."
      keyExtractor={(m) => m.id}
    >
      <DataTable.Column<MatchWithVenue>
        header="Day"
        className="w-16"
        render={(m) => <Badge variant="outline">{m.matchDay}</Badge>}
      />
      <DataTable.Column<MatchWithVenue>
        header="Opponent"
        render={(m) => <TeamLabel team={m.opponent} />}
      />
      <DataTable.Column<MatchWithVenue>
        header="Venue"
        className="w-20"
        render={(m) => (
          <Badge variant={m.isHome ? "default" : "secondary"}>
            {m.isHome ? "Home" : "Away"}
          </Badge>
        )}
      />
    </DataTable>
  );
}
