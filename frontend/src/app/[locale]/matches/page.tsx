import { Suspense } from "react";
import { MatchesPageContent } from "@/features/matches/components/matches-page-content";

export default function MatchesPage() {
  return (
    <Suspense>
      <MatchesPageContent />
    </Suspense>
  );
}
