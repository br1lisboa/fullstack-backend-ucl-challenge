import type { Match } from "@/shared/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TeamMatchesTableProps {
  matches: Match[];
  teamId: number;
}

export function TeamMatchesTable({ matches, teamId }: TeamMatchesTableProps) {
  if (matches.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No matches yet. Execute a draw first.
      </p>
    );
  }

  const sorted = matches.toSorted((a, b) => a.matchDay - b.matchDay);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Day</TableHead>
          <TableHead>Opponent</TableHead>
          <TableHead className="w-20">Venue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((match) => {
          const isHome = match.homeTeam.id === teamId;
          const opponent = isHome ? match.awayTeam : match.homeTeam;

          return (
            <TableRow key={match.id}>
              <TableCell>
                <Badge variant="outline">{match.matchDay}</Badge>
              </TableCell>
              <TableCell>
                <span className="font-medium">{opponent.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {opponent.country.name}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={isHome ? "default" : "secondary"}>
                  {isHome ? "Home" : "Away"}
                </Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
