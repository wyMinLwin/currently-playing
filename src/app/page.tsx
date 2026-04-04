import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSessionUser } from "@/lib/auth";
import { EmbedSection } from "./embed-section";
import { LogoutButton } from "./logout-button";

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export default async function HomePage() {
  const user = await getSessionUser();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const cardUrl = `${baseUrl}/api/spotify/currently-playing/${user.publicId}`;
  const initials = user.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <div className="flex flex-1 flex-col items-center justify-center relative overflow-hidden px-4 py-12 sm:py-16">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.16_0.02_55)_0%,_transparent_60%)]" />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-3">
          <Avatar className="size-20 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
            <AvatarFallback className="text-xl font-heading font-bold bg-gradient-to-br from-primary/30 to-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="text-center space-y-1.5">
            <h1 className="font-heading text-xl font-bold tracking-tight">
              {user.displayName ?? user.spotifyUserId}
            </h1>
            <Badge variant="secondary" className="gap-1.5 text-xs">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Connected
            </Badge>
          </div>
        </div>

        {/* Currently Playing Card Preview */}
        <Card className="w-full bg-card/60 backdrop-blur-xl ring-white/[0.06] shadow-2xl shadow-black/20 py-0 gap-0">
          <CardContent className="p-4 sm:p-5 space-y-3">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground/50 font-medium">
              Live Preview
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cardUrl}
              alt="Currently Playing"
              className="w-full rounded-lg"
            />
          </CardContent>
        </Card>

        {/* Embed code */}
        <EmbedSection cardUrl={cardUrl} />

        {/* Actions */}
        <div className="flex items-center gap-4">
          <LogoutButton />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/40">
            <SpotifyIcon className="size-3.5" />
            <span>Powered by Spotify</span>
          </div>
        </div>
      </div>
    </div>
  );
}
