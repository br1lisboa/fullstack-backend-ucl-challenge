"use client";

import { useMatchFilters, useMatches } from "../hooks";
import { useQueryParams } from "@/shared/hooks/use-query-params";
import { DataTable } from "@/shared/components/data-table";
import { Pagination } from "@/shared/components/pagination";
import { TeamLabel } from "@/shared/components/team-label";
import { Badge } from "@/components/ui/badge";
import { useDictionary } from "@/i18n/context";
import type { Match } from "@/shared/types";

export function MatchList() {
  const filters = useMatchFilters();
  const { data, isLoading, error } = useMatches(filters);
  const qp = useQueryParams("/matches");
  const t = useDictionary();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <DataTable<Match>
        data={data?.matches}
        loading={isLoading}
        error={error?.message}
        empty={t.matches.noMatches}
        keyExtractor={(m) => m.id}
        isPending={qp.isPending}
      >
        <DataTable.Column<Match>
          header={t.matches.headerDay}
          className="w-16"
          render={(m) => <Badge variant="outline">{m.matchDay}</Badge>}
        />
        <DataTable.Column<Match>
          header={t.matches.headerHome}
          render={(m) => <TeamLabel team={m.homeTeam} />}
        />
        <DataTable.Column<Match>
          header=""
          className="w-12 text-center text-xs text-muted-foreground"
          render={() => t.matches.vs}
        />
        <DataTable.Column<Match>
          header={t.matches.headerAway}
          render={(m) => <TeamLabel team={m.awayTeam} />}
        />
      </DataTable>

      {data ? (
        <Pagination
          page={data.pagination.page}
          totalPages={data.pagination.totalPages}
          total={data.pagination.total}
          onPageChange={qp.setPage}
          isPending={qp.isPending}
        />
      ) : null}
    </div>
  );
}
