"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useMatchFilters, useMatches } from "../hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function MatchList() {
  const filters = useMatchFilters();
  const { data, isLoading, error } = useMatches(filters);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    startTransition(() => {
      router.push(`/matches?${params.toString()}`);
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        Failed to load matches: {error.message}
      </p>
    );
  }

  if (!data || data.matches.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No matches found. Try adjusting your filters or execute a draw first.
      </p>
    );
  }

  const { matches, pagination } = data;

  return (
    <div className="space-y-4" style={{ opacity: isPending ? 0.7 : 1 }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Day</TableHead>
            <TableHead>Home</TableHead>
            <TableHead className="w-12 text-center">vs</TableHead>
            <TableHead>Away</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <TableRow key={match.id}>
              <TableCell>
                <Badge variant="outline">{match.matchDay}</Badge>
              </TableCell>
              <TableCell>
                <span className="font-medium">{match.homeTeam.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {match.homeTeam.country.name}
                </span>
              </TableCell>
              <TableCell className="text-center text-xs text-muted-foreground">
                vs
              </TableCell>
              <TableCell>
                <span className="font-medium">{match.awayTeam.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {match.awayTeam.country.name}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {pagination.total} matches — Page {pagination.page} of{" "}
          {pagination.totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => goToPage(pagination.page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => goToPage(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
