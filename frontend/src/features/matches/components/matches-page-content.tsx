"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { MatchFilters } from "./match-filters";
import { MatchList } from "./match-list";
import { useDictionary } from "@/i18n/context";

export function MatchesPageContent() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchParams = useSearchParams();
  const t = useDictionary();

  const hasActiveFilters =
    searchParams.has("teamId") ||
    searchParams.has("matchDay") ||
    searchParams.has("countryId");

  return (
    <div className="flex max-h-[calc(100dvh-8rem)] flex-col gap-6">
      <div className="shrink-0 space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            {t.matches.title}
          </h1>
          <button
            type="button"
            onClick={() => setFiltersOpen((prev) => !prev)}
            className="relative text-muted-foreground transition-colors hover:text-foreground sm:hidden"
          >
            <SlidersHorizontal className="size-5" />
            {hasActiveFilters ? (
              <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-primary" />
            ) : null}
          </button>
        </div>
        <p className="text-base text-muted-foreground">
          {t.matches.description}
        </p>
      </div>
      <MatchFilters mobileOpen={filtersOpen} />
      <MatchList />
    </div>
  );
}
