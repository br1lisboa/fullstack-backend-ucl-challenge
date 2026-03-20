"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function MatchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== null && value !== "" && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/matches?${params.toString()}`);
    });
  }

  function clearFilters() {
    startTransition(() => {
      router.push("/matches");
    });
  }

  const hasFilters =
    searchParams.has("teamId") ||
    searchParams.has("matchDay") ||
    searchParams.has("matchDayFrom") ||
    searchParams.has("matchDayTo") ||
    searchParams.has("countryId");

  return (
    <div
      className="flex flex-wrap items-end gap-3"
      style={{ opacity: isPending ? 0.7 : 1 }}
    >
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Team ID</label>
        <Input
          type="number"
          placeholder="e.g. 1"
          className="w-24"
          value={searchParams.get("teamId") || ""}
          onChange={(e) => updateParam("teamId", e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Match Day</label>
        <Select
          value={searchParams.get("matchDay") || "all"}
          onValueChange={(v) => updateParam("matchDay", v)}
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
        <label className="text-xs text-muted-foreground">Country ID</label>
        <Input
          type="number"
          placeholder="e.g. 1"
          className="w-24"
          value={searchParams.get("countryId") || ""}
          onChange={(e) => updateParam("countryId", e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Sort By</label>
        <Select
          value={searchParams.get("sortBy") || "matchDay"}
          onValueChange={(v) => updateParam("sortBy", v)}
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
          value={searchParams.get("sortOrder") || "asc"}
          onValueChange={(v) => updateParam("sortOrder", v)}
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
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
