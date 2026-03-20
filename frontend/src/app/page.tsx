import { DrawActions } from "@/features/draw/components/draw-actions";
import { DrawStats } from "@/features/draw/components/draw-stats";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Champions League Draw
        </h1>
        <p className="max-w-lg text-base text-muted-foreground">
          Swiss Round format — 36 teams, 8 match days, 144 matches.
        </p>
        <DrawActions />
      </div>

      <DrawStats />

      <div className="flex flex-col gap-3 sm:flex-row md:hidden">
        <Button variant="outline" render={<Link href="/matches" />}>
          View Matches
          <ArrowRight className="ml-2 size-4" />
        </Button>
        <Button variant="outline" render={<Link href="/teams" />}>
          View Teams
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}
