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
import { cn } from "@/lib/utils";

function FilterControls() {
  const qp = useQueryParams("/matches");
  const isPending = qp.isPending;
  const { data: teams } = useTeams();
  const { data: countries } = useCountries();

  const teamOptions = useMemo(
    () =>
      (teams ?? []).map((t) => ({
        value: String(t.id),
        label: t.name,
      })),
    [teams],
  );

  const countryOptions = useMemo(
    () =>
      (countries ?? []).map((c) => ({
        value: String(c.id),
        label: c.name,
      })),
    [countries],
  );

  const selectedTeamIds = qp.getAll("teamId");
  const selectedCountryIds = qp.getAll("countryId");

  const hasFilters = qp.has(
    "teamId",
    "matchDay",
    "matchDayFrom",
    "matchDayTo",
    "countryId",
  );

  return (
    <div
      className={`flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center${isPending ? " opacity-70" : ""}`}
    >
      <ComboBox
        options={teamOptions}
        selected={selectedTeamIds}
        onChange={(vals) => qp.setMultiple("teamId", vals)}
        placeholder="Filter by team..."
        className="w-full sm:w-52"
      />

      <Select
        value={qp.get("matchDay") || "all"}
        onValueChange={(v) => qp.set("matchDay", v)}
      >
        <SelectTrigger className="w-full sm:w-32">
          <SelectValue placeholder="Match day" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All days</SelectItem>
          {Array.from({ length: 8 }, (_, i) => (
            <SelectItem key={i + 1} value={String(i + 1)}>
              Day {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ComboBox
        options={countryOptions}
        selected={selectedCountryIds}
        onChange={(vals) => qp.setMultiple("countryId", vals)}
        placeholder="Filter by country..."
        className="w-full sm:w-52"
      />

      <Select
        value={qp.get("sortBy") || "matchDay"}
        onValueChange={(v) => qp.set("sortBy", v)}
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="matchDay">Sort: Match Day</SelectItem>
          <SelectItem value="homeTeam">Sort: Home Team</SelectItem>
          <SelectItem value="awayTeam">Sort: Away Team</SelectItem>
          <SelectItem value="id">Sort: ID</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={qp.get("sortOrder") || "asc"}
        onValueChange={(v) => qp.set("sortOrder", v)}
      >
        <SelectTrigger className="w-full sm:w-24">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Asc</SelectItem>
          <SelectItem value="desc">Desc</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters ? (
        <Button variant="ghost" size="sm" onClick={qp.clear}>
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}

export function MatchFilters({ mobileOpen = false }: { mobileOpen?: boolean }) {
  return (
    <div className="shrink-0">
      {/* Desktop: always visible */}
      <div className="hidden sm:block">
        <FilterControls />
      </div>

      {/* Mobile: collapsible controlled by parent */}
      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out sm:hidden",
          mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <div className="pb-1">
            <FilterControls />
          </div>
        </div>
      </div>
    </div>
  );
}
