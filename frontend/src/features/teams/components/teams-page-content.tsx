"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { TeamGrid } from "./team-grid";
import { useTeams } from "../hooks";
import { Skeleton } from "@/components/ui/skeleton";

export function TeamsPageContent() {
  const { data: teams, isLoading } = useTeams();
  const [search, setSearch] = useState("");

  const filteredTeams = useMemo(() => {
    if (!teams) return [];
    if (!search) return teams;
    const term = search.toLowerCase();
    return teams.filter((t) => t.name.toLowerCase().includes(term));
  }, [teams, search]);

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Input
        type="text"
        placeholder="Search teams by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:max-w-sm"
      />
      <TeamGrid teams={filteredTeams} />
    </div>
  );
}
