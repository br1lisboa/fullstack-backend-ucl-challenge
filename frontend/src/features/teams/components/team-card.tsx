import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Team } from "@/shared/types";

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link href={`/teams/${team.id}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{team.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="outline">{team.country.name}</Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
