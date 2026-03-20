"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSelector } from "./language-selector";
import { useDictionary, useLocale } from "@/i18n/context";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string, locale: string) {
  const localePath = `/${locale}`;
  if (href === `/${locale}`) return pathname === localePath;
  return pathname.startsWith(href);
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useDictionary();

  const links = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/matches`, label: t.nav.matches },
    { href: `/${locale}/teams`, label: t.nav.teams },
    { href: `/${locale}/draw`, label: t.nav.draw },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-8 px-4">
        <Link
          href={`/${locale}`}
          className="text-lg font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          UCL Draw
        </Link>

        {/* Desktop links */}
        <div className="hidden gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive(pathname, link.href, locale)
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <LanguageSelector />
          <ThemeToggle />
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 md:hidden"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
            <span className="sr-only">{t.nav.menu}</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0">
          <div className="border-t border-border/50 bg-background px-4 pb-4 pt-2">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    isActive(pathname, link.href, locale)
                      ? "text-primary bg-muted"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
