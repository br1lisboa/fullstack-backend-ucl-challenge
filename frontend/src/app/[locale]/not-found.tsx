import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";
import { defaultLocale } from "@/i18n/config";

export default async function NotFoundPage() {
  const t = await getDictionary(defaultLocale);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="text-6xl font-bold text-muted-foreground">404</div>
      <h1 className="text-2xl font-bold">{t.notFound.title}</h1>
      <p className="text-muted-foreground max-w-md">
        {t.notFound.description}
      </p>
      <Link
        href={`/${defaultLocale}`}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
      >
        {t.notFound.goHome}
      </Link>
    </div>
  );
}
