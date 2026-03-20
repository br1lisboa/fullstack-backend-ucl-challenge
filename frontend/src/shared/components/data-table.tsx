"use client";

import { createContext, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";

interface ColumnDef<T> {
  header: string;
  className?: string;
  render: (item: T) => React.ReactNode;
}

interface DataTableContextValue<T> {
  columns: ColumnDef<T>[];
}

const DataTableContext = createContext<DataTableContextValue<unknown>>({
  columns: [],
});

interface DataTableProps<T> {
  data: T[] | undefined;
  loading?: boolean;
  error?: string;
  empty?: string;
  keyExtractor: (item: T) => string | number;
  children: React.ReactNode;
  isPending?: boolean;
}

function DataTableRoot<T>({
  data,
  loading,
  error,
  empty = "No data found.",
  keyExtractor,
  children,
  isPending,
}: DataTableProps<T>) {
  const columns: ColumnDef<T>[] = [];

  const childArray = Array.isArray(children) ? children : [children];
  for (const child of childArray) {
    if (child && typeof child === "object" && "props" in child) {
      const props = child.props as ColumnDef<T>;
      if (props.header !== undefined && typeof props.render === "function") {
        columns.push(props);
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (error) return <ErrorState message={error} />;

  if (!data || data.length === 0) return <EmptyState message={empty} />;

  return (
    <div style={{ opacity: isPending ? 0.7 : 1 }}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.header} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={keyExtractor(item)}>
              {columns.map((col) => (
                <TableCell key={col.header} className={col.className}>
                  {col.render(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function Column<T>(_props: ColumnDef<T>) {
  return null;
}

export const DataTable = Object.assign(DataTableRoot, { Column });
