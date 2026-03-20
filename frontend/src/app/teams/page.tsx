import { TeamsPageContent } from "@/features/teams/components/teams-page-content";

export default function TeamsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
        <p className="text-base text-muted-foreground">
          36 teams grouped by pot.
        </p>
      </div>
      <TeamsPageContent />
    </div>
  );
}
