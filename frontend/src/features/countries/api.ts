import { apiFetch } from "@/shared/api-client";
import type { Country } from "@/shared/types";

export function fetchCountries(): Promise<Country[]> {
  return apiFetch<Country[]>("/countries");
}
