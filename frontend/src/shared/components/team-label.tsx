import type { Team } from "@/shared/types";

interface TeamLabelProps {
  team: Team;
}

export function TeamLabel({ team }: TeamLabelProps) {
  return (
    <span>
      <span className="font-medium">{team.name}</span>
      <span className="ml-2 text-xs text-muted-foreground">
        {team.country.name}
      </span>
    </span>
  );
}
