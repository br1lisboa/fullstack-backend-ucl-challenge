"use client";

import { useEffect } from "react";
import { useDictionary, useLocale } from "@/i18n/context";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useDictionary();
  const locale = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="text-5xl">!</div>
      <h1 className="text-2xl font-bold">{t.error.title}</h1>
      <p className="text-muted-foreground max-w-md">{t.error.description}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          {t.error.tryAgain}
        </button>
        <a
          href={`/${locale}`}
          className="border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md border px-4 py-2 text-sm font-medium transition-colors"
        >
          {t.error.goHome}
        </a>
      </div>
    </div>
  );
}
