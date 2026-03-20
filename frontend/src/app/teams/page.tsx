import { TeamsPageContent } from "@/features/teams/components/teams-page-content";

export default function TeamsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Teams</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          36 teams grouped by pot.
        </p>
      </div>
      <TeamsPageContent />
    </div>
  );
}
