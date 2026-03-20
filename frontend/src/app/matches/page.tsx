import { Suspense } from "react";
import { MatchFilters } from "@/features/matches/components/match-filters";
import { MatchList } from "@/features/matches/components/match-list";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function MatchesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Matches</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse all 144 matches with filters, sorting and pagination.
        </p>
      </div>
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <MatchFilters />
      </Suspense>
      <Separator />
      <Suspense
        fallback={
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        }
      >
        <MatchList />
      </Suspense>
    </div>
  );
}
