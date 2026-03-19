import { DrawActions } from "@/features/draw/components/draw-actions";
import { DrawStats } from "@/features/draw/components/draw-stats";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Champions League Draw</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Swiss Round format — 36 teams, 8 match days, 144 matches.
        </p>
      </div>
      <DrawActions />
      <Separator />
      <DrawStats />
      <Separator />
      <div className="flex gap-4">
        <Link
          href="/matches"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          View Matches
        </Link>
        <Link
          href="/teams"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          View Teams
        </Link>
      </div>
    </div>
  );
}
