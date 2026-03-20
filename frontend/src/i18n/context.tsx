"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "./config";
import type en from "../../messages/en.json";

type Dictionary = typeof en;

interface I18nContextValue {
  locale: Locale;
  dictionary: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  dictionary,
  children,
}: I18nContextValue & { children: React.ReactNode }) {
  const value = useMemo(
    () => ({ locale, dictionary }),
    [locale, dictionary]
  );

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useDictionary() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useDictionary must be used within I18nProvider");
  return ctx.dictionary;
}

export function useLocale() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLocale must be used within I18nProvider");
  return ctx.locale;
}
