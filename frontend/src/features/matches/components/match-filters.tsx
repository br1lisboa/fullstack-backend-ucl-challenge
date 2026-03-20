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
import { useDictionary } from "@/i18n/context";
import { cn } from "@/lib/utils";

function FilterControls() {
  const qp = useQueryParams("/matches");
  const isPending = qp.isPending;
  const { data: teams } = useTeams();
  const { data: countries } = useCountries();
  const t = useDictionary();

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

  const matchDay = qp.get("matchDay") || "all";
  const sortBy = qp.get("sortBy") || "matchDay";
  const sortOrder = qp.get("sortOrder") || "asc";

  const matchDayLabel =
    matchDay === "all"
      ? t.matches.allDays
      : t.matches.day.replace("{n}", matchDay);

  const sortByLabels: Record<string, string> = {
    matchDay: t.matches.sortMatchDay,
    homeTeam: t.matches.sortHomeTeam,
    awayTeam: t.matches.sortAwayTeam,
    id: t.matches.sortId,
  };

  const sortOrderLabels: Record<string, string> = {
    asc: t.matches.asc,
    desc: t.matches.desc,
  };

  return (
    <div
      className={`flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center${isPending ? " opacity-70" : ""}`}
    >
      <ComboBox
        options={teamOptions}
        selected={selectedTeamIds}
        onChange={(vals) => qp.setMultiple("teamId", vals)}
        placeholder={t.matches.filterByTeam}
        className="w-full sm:w-50"
      />

      <Select value={matchDay} onValueChange={(v) => qp.set("matchDay", v)}>
        <SelectTrigger className="w-full sm:w-32">
          <SelectValue placeholder={t.matches.allDays}>
            {matchDayLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.matches.allDays}</SelectItem>
          {Array.from({ length: 8 }, (_, i) => (
            <SelectItem key={i + 1} value={String(i + 1)}>
              {t.matches.day.replace("{n}", String(i + 1))}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ComboBox
        options={countryOptions}
        selected={selectedCountryIds}
        onChange={(vals) => qp.setMultiple("countryId", vals)}
        placeholder={t.matches.filterByCountry}
        className="w-full sm:w-52"
      />

      <Select value={sortBy} onValueChange={(v) => qp.set("sortBy", v)}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder={t.matches.sortMatchDay}>
            {sortByLabels[sortBy] ?? sortBy}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="matchDay">{t.matches.sortMatchDay}</SelectItem>
          <SelectItem value="homeTeam">{t.matches.sortHomeTeam}</SelectItem>
          <SelectItem value="awayTeam">{t.matches.sortAwayTeam}</SelectItem>
          <SelectItem value="id">{t.matches.sortId}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortOrder} onValueChange={(v) => qp.set("sortOrder", v)}>
        <SelectTrigger className="w-full sm:w-24">
          <SelectValue placeholder={t.matches.asc}>
            {sortOrderLabels[sortOrder] ?? sortOrder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">{t.matches.asc}</SelectItem>
          <SelectItem value="desc">{t.matches.desc}</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters ? (
        <Button variant="ghost" size="sm" onClick={qp.clear}>
          {t.matches.clearFilters}
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
