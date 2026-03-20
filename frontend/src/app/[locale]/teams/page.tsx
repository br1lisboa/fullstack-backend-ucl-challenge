import { TeamsPageContent } from "@/features/teams/components/teams-page-content";
import { getDictionary } from "@/i18n/dictionaries";
import { locales, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default async function TeamsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const t = await getDictionary(locale as Locale);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{t.teams.title}</h1>
        <p className="text-base text-muted-foreground">
          {t.teams.description}
        </p>
      </div>
      <TeamsPageContent />
    </div>
  );
}
