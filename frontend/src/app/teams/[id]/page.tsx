import { notFound } from "next/navigation";
import { fetchTeamById } from "@/features/teams/api";
import { TeamMatchesTable } from "@/features/teams/components/team-matches-table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ApiError } from "@/shared/api-client";

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const teamId = parseInt(id, 10);

  if (isNaN(teamId) || teamId < 1) notFound();

  let data;
  try {
    data = await fetchTeamById(teamId);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const { team, matches } = data;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/teams"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to Teams
        </Link>
        <h1 className="mt-2 text-2xl font-bold">{team.name}</h1>
        <Badge variant="outline" className="mt-1">
          {team.country.name}
        </Badge>
      </div>
      <Separator />
      <div>
        <h2 className="mb-3 text-lg font-semibold">
          Matches ({matches.length})
        </h2>
        <TeamMatchesTable matches={matches} teamId={team.id} />
      </div>
    </div>
  );
}
