"use client";

import { useQueryParams } from "@/shared/hooks/use-query-params";
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
  const qp = useQueryParams("/matches");

  const hasFilters = qp.has(
    "teamId",
    "matchDay",
    "matchDayFrom",
    "matchDayTo",
    "countryId"
  );

  return (
    <div
      className="flex flex-wrap items-end gap-3"
      style={{ opacity: qp.isPending ? 0.7 : 1 }}
    >
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Team ID</label>
        <Input
          type="number"
          placeholder="e.g. 1"
          className="w-24"
          value={qp.get("teamId") || ""}
          onChange={(e) => qp.set("teamId", e.target.value)}
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
        <label className="text-xs text-muted-foreground">Country ID</label>
        <Input
          type="number"
          placeholder="e.g. 1"
          className="w-24"
          value={qp.get("countryId") || ""}
          onChange={(e) => qp.set("countryId", e.target.value)}
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
