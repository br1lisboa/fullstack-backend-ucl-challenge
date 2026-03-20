import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamGrid } from "@/features/teams/components/team-grid";
import { fetchTeams } from "@/features/teams/api";

async function TeamsContent() {
  const teams = await fetchTeams();
  return <TeamGrid teams={teams} />;
}

export default function TeamsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Teams</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          36 teams grouped by pot.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        }
      >
        <TeamsContent />
      </Suspense>
    </div>
  );
}
