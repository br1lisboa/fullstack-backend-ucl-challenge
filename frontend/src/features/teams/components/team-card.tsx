"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/i18n/context";
import type { Team } from "@/shared/types";

export function TeamCard({ team }: { team: Team }) {
  const locale = useLocale();

  return (
    <Link href={`/${locale}/teams/${team.id}`}>
      <Card className="transition-all hover:shadow-md hover:border-primary/30">
        <CardHeader className="pb-1">
          <CardTitle className="text-sm font-semibold">{team.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">{team.country.name}</Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
