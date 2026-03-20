import { DrawActions } from "@/features/draw/components/draw-actions";
import { DrawStats } from "@/features/draw/components/draw-stats";
import { Separator } from "@/components/ui/separator";
import { getDictionary } from "@/i18n/dictionaries";
import { locales, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default async function DrawPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const t = await getDictionary(locale as Locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.draw.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.draw.description}
        </p>
      </div>
      <DrawActions />
      <Separator />
      <div>
        <h2 className="mb-4 text-lg font-semibold">{t.draw.statistics}</h2>
        <DrawStats />
      </div>
    </div>
  );
}
