"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDraw } from "@/features/draw/hooks";
import {
  Trophy,
  CalendarDays,
  Swords,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Trophy,
    value: "36",
    title: "Teams",
    description: "Divided into 4 pots based on UEFA ranking",
  },
  {
    icon: CalendarDays,
    value: "8",
    title: "Match Days",
    description: "Each team plays 8 matches — 4 home, 4 away",
  },
  {
    icon: Swords,
    value: "144",
    title: "Matches",
    description: "Generated respecting Swiss Round constraints",
  },
  {
    icon: Sparkles,
    value: "1",
    title: "Draw",
    description: "One click to simulate the complete draw",
  },
];

export default function HomePage() {
  const { data: draw, isLoading, isError } = useDraw();
  const hasActiveDraw = !!draw && !isLoading && !isError;

  return (
    <div className="-mx-4 -mt-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-20 text-white sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.1),_transparent_60%)]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium tracking-widest text-blue-300 uppercase">
            Swiss Round Format
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            UEFA Champions League
          </h1>
          <p className="mt-2 text-xl font-light text-blue-200 sm:text-2xl">
            Draw Simulator
          </p>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-300">
            Simulate the official draw for the new Champions League format with
            36 teams, 8 match days, and 144 matches — all generated respecting
            the tournament constraints.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              render={<Link href="/draw" />}
              className="bg-blue-600 px-8 text-base font-semibold text-white hover:bg-blue-500"
            >
              Go to Draw
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight">
          How It Works
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{feature.value}</p>
                  <p className="font-medium">{feature.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Draw Completed Banner */}
      {hasActiveDraw && (
        <section className="mx-auto max-w-5xl px-4 pb-16">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
              <div className="flex-1">
                <p className="text-lg font-semibold">Draw Completed</p>
                <p className="text-sm text-muted-foreground">
                  144 matches have been generated. Explore the results.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" render={<Link href="/matches" />}>
                  View Matches
                </Button>
                <Button variant="outline" render={<Link href="/teams" />}>
                  View Teams
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
