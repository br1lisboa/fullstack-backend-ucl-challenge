"use client";

import { Button } from "@/components/ui/button";

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
  return (
    <div
      className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between transition-opacity"
      style={{ opacity: isPending ? 0.7 : 1 }}
    >
      <p className="text-sm text-muted-foreground">
        {total} results — Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
