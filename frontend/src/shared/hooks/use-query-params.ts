"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useCallback, useMemo } from "react";

const EMPTY_ARRAY: string[] = [];
const LOCALE_PREFIX_RE = /^\/([a-z]{2})(\/|$)/;

export function useQueryParams(basePath: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Extract locale prefix from current pathname (e.g., "/en" from "/en/matches")
  const localePrefix = useMemo(() => {
    const match = pathname.match(LOCALE_PREFIX_RE);
    return match ? `/${match[1]}` : "";
  }, [pathname]);

  const fullBasePath = `${localePrefix}${basePath}`;

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
        router.push(`${fullBasePath}?${params.toString()}`);
      });
    },
    [searchParams, fullBasePath, router]
  );

  const setPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      startTransition(() => {
        router.push(`${fullBasePath}?${params.toString()}`);
      });
    },
    [searchParams, fullBasePath, router]
  );

  const clear = useCallback(() => {
    startTransition(() => {
      router.push(fullBasePath);
    });
  }, [fullBasePath, router]);

  const getAll = useCallback(
    (key: string): string[] => {
      const val = searchParams.get(key);
      if (!val) return EMPTY_ARRAY;
      return val.split(",").filter(Boolean);
    },
    [searchParams]
  );

  const setMultiple = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (values.length > 0) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`${fullBasePath}?${params.toString()}`);
      });
    },
    [searchParams, fullBasePath, router]
  );

  const has = useCallback(
    (...keys: string[]) => keys.some((k) => searchParams.has(k)),
    [searchParams]
  );

  return { get, getAll, getNumber, set, setMultiple, setPage, clear, has, isPending };
}
