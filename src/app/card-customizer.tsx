"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { THEMES, THEME_NAMES, DEFAULT_THEME } from "@/lib/svg-themes";
import { EmbedSection } from "./embed-section";

const STORAGE_KEY = "cp:theme";

/**
 * Owns the selected theme: drives the live preview image, the embed snippet,
 * and a button-group picker. Persists the choice to localStorage so it sticks
 * across visits. `cardUrl` is the base embed URL with no `?theme=` param.
 */
export function CardCustomizer({ cardUrl }: { cardUrl: string }) {
  // Start at default so server and first client render match (no hydration
  // mismatch), then sync from localStorage once mounted.
  const [theme, setTheme] = useState(DEFAULT_THEME);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && THEME_NAMES.includes(stored)) {
      setTheme(stored);
    }
  }, []);

  const selectTheme = (name: string) => {
    setTheme(name);
    localStorage.setItem(STORAGE_KEY, name);
  };

  const themedUrl =
    theme === DEFAULT_THEME ? cardUrl : `${cardUrl}?theme=${theme}`;

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Live preview */}
      <Card className="w-full bg-card/60 backdrop-blur-xl ring-white/[0.06] shadow-2xl shadow-black/20 py-0 gap-0">
        <CardContent className="p-4 sm:p-5 space-y-3">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground/50 font-medium">
            Live Preview
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={themedUrl}
            alt="Currently Playing"
            className="w-full rounded-lg"
          />
        </CardContent>
      </Card>

      {/* Theme picker */}
      <div className="w-full">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground/50 font-medium mb-2.5">
          Theme
        </p>
        <div className="flex flex-wrap gap-2">
          {THEME_NAMES.map((name) => {
            const palette = THEMES[name];
            const active = name === theme;
            return (
              <button
                key={name}
                onClick={() => selectTheme(name)}
                aria-pressed={active}
                className={`
                  flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs capitalize transition-all cursor-pointer
                  ${
                    active
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-border/50 text-muted-foreground/70 hover:text-foreground hover:bg-muted/50"
                  }
                `}
              >
                <span
                  className="size-3 rounded-full ring-1 ring-white/10"
                  style={{
                    background: `linear-gradient(135deg, ${palette.bg} 50%, ${palette.accent} 50%)`,
                  }}
                />
                {name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Embed snippet (themed) */}
      <EmbedSection cardUrl={themedUrl} />
    </div>
  );
}
