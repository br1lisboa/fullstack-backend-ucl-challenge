"use client";

import type { Team } from "@/shared/types";
import { TeamCard } from "./team-card";
import { useDictionary } from "@/i18n/context";

interface TeamGridProps {
  teams: Team[];
}

export function TeamGrid({ teams }: TeamGridProps) {
  const t = useDictionary();

  const teamsByPot = new Map<number, Team[]>();
  teams.forEach((team, index) => {
    const pot = Math.floor(index / 9) + 1;
    const list = teamsByPot.get(pot) || [];
    list.push(team);
    teamsByPot.set(pot, list);
  });

  return (
    <div className="space-y-8">
      {Array.from(teamsByPot.entries()).map(([pot, potTeams]) => (
        <div key={pot}>
          <h2 className="mb-3 text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {t.teams.pot.replace("{n}", String(pot))}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {potTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
