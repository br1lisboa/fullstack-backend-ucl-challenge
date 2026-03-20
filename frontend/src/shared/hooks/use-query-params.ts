"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useCallback } from "react";

export function useQueryParams(basePath: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const get = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams]
  );

  const getNumber = useCallback(
    (key: string, fallback?: number) => {
      const val = searchParams.get(key);
      return val ? Number(val) : fallback;
    },
    [searchParams]
  );

  const set = useCallback(
    (key: string, value: string | null, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value !== null && value !== "" && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (resetPage) params.delete("page");
      startTransition(() => {
        router.push(`${basePath}?${params.toString()}`);
      });
    },
    [searchParams, basePath, router]
  );

  const setPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      startTransition(() => {
        router.push(`${basePath}?${params.toString()}`);
      });
    },
    [searchParams, basePath, router]
  );

  const clear = useCallback(() => {
    startTransition(() => {
      router.push(basePath);
    });
  }, [basePath, router]);

  const has = useCallback(
    (...keys: string[]) => keys.some((k) => searchParams.has(k)),
    [searchParams]
  );

  return { get, getNumber, set, setPage, clear, has, isPending };
}
