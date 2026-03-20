import { notFound } from "next/navigation";
import { fetchTeamById } from "@/features/teams/api";
import { TeamMatchesTable } from "@/features/teams/components/team-matches-table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
    <div className="space-y-8">
      <div className="space-y-3">
        <Link
          href="/teams"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          Back to Teams
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
          <Badge variant="secondary">{team.country.name}</Badge>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Matches ({matches.length})
        </h2>
        <TeamMatchesTable matches={matches} teamId={team.id} />
      </div>
    </div>
  );
}
