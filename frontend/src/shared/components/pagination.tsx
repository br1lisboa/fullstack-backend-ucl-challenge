"use client";

import { Button } from "@/components/ui/button";
import { useDictionary } from "@/i18n/context";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  isPending?: boolean;
}

export function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
  isPending,
}: PaginationProps) {
  const t = useDictionary();

  const resultsText = t.matches.results
    .replace("{total}", String(total))
    .replace("{page}", String(page))
    .replace("{totalPages}", String(totalPages));

  return (
    <div
      className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between transition-opacity"
      style={{ opacity: isPending ? 0.7 : 1 }}
    >
      <p className="text-sm text-muted-foreground">{resultsText}</p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          {t.matches.previous}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          {t.matches.next}
        </Button>
      </div>
    </div>
  );
}
