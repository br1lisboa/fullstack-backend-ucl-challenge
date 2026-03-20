"use client";

import { useMemo } from "react";
import { useQueryParams } from "@/shared/hooks/use-query-params";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ComboBox } from "@/components/ui/combo-box";
import { useTeams } from "@/features/teams/hooks";
import { useCountries } from "@/features/countries/hooks";

export function MatchFilters() {
  const qp = useQueryParams("/matches");
  const { data: teams } = useTeams();
  const { data: countries } = useCountries();

  const teamOptions = useMemo(
    () =>
      (teams ?? []).map((t) => ({
        value: String(t.id),
        label: t.name,
      })),
    [teams]
  );

  const countryOptions = useMemo(
    () =>
      (countries ?? []).map((c) => ({
        value: String(c.id),
        label: c.name,
      })),
    [countries]
  );

  const selectedTeamIds = qp.getAll("teamId");
  const selectedCountryIds = qp.getAll("countryId");

  const hasFilters = qp.has(
    "teamId",
    "matchDay",
    "matchDayFrom",
    "matchDayTo",
    "countryId"
  );

  return (
    <div
      className={`flex flex-wrap items-end gap-3${qp.isPending ? " opacity-70" : ""}`}
    >
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Teams</label>
        <ComboBox
          options={teamOptions}
          selected={selectedTeamIds}
          onChange={(vals) => qp.setMultiple("teamId", vals)}
          placeholder="Search teams..."
          className="w-52"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Match Day</label>
        <Select
          value={qp.get("matchDay") || "all"}
          onValueChange={(v) => qp.set("matchDay", v)}
        >
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Array.from({ length: 8 }, (_, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                Day {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Countries</label>
        <ComboBox
          options={countryOptions}
          selected={selectedCountryIds}
          onChange={(vals) => qp.setMultiple("countryId", vals)}
          placeholder="Search countries..."
          className="w-52"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Sort By</label>
        <Select
          value={qp.get("sortBy") || "matchDay"}
          onValueChange={(v) => qp.set("sortBy", v)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="matchDay">Match Day</SelectItem>
            <SelectItem value="homeTeam">Home Team</SelectItem>
            <SelectItem value="awayTeam">Away Team</SelectItem>
            <SelectItem value="id">ID</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Order</label>
        <Select
          value={qp.get("sortOrder") || "asc"}
          onValueChange={(v) => qp.set("sortOrder", v)}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Asc</SelectItem>
            <SelectItem value="desc">Desc</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters ? (
        <Button variant="ghost" size="sm" onClick={qp.clear}>
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
