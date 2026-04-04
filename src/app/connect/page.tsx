"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Check, CheckCircle, AlertCircle } from "lucide-react";

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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 px-4 rounded-lg hover:bg-foreground/[0.04] cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="size-3.5" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="size-3.5" />
          <span>Copy embed code</span>
        </>
      )}
    </button>
  );
}

export default function ConnectPage() {
  return (
    <Suspense>
      <ConnectContent />
    </Suspense>
  );
}

function ConnectContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";
  const publicId = searchParams.get("publicId");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const cardUrl = publicId
    ? `${baseUrl}/api/spotify/currently-playing/${publicId}`
    : null;
  const embedMarkdown = cardUrl
    ? `[![Currently Playing](${cardUrl})](${cardUrl})`
    : null;

  if (success && publicId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center relative overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.18_0.03_55)_0%,_transparent_70%)]" />
        <div className="absolute top-1/4 -left-32 size-72 rounded-full bg-primary/[0.06] blur-[100px]" />
        <div className="absolute bottom-1/3 -right-24 size-56 rounded-full bg-primary/[0.04] blur-[80px]" />

        <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-md">
          <CheckCircle className="size-16 text-spotify" />

          <div className="space-y-4">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
              Connected<span className="text-primary">!</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xs sm:max-w-sm mx-auto">
              Your Spotify account is linked. Use the embed below in your GitHub
              README or anywhere that renders markdown.
            </p>
          </div>

          {/* Card preview */}
          {cardUrl && (
            <div className="w-full space-y-3">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground/50 font-medium">
                Preview
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cardUrl}
                alt="Currently Playing"
                className="w-full rounded-lg"
              />
            </div>
          )}

          {/* Embed code */}
          {embedMarkdown && (
            <div className="w-full space-y-2">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground/50 font-medium">
                Markdown
              </p>
              <code className="block w-full text-xs text-muted-foreground bg-muted/40 rounded-lg p-3 text-left break-all select-all">
                {embedMarkdown}
              </code>
              <CopyButton text={embedMarkdown} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Warm radial gradient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.18_0.03_55)_0%,_transparent_70%)]" />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 -left-32 size-72 rounded-full bg-primary/[0.06] blur-[100px]" />
      <div className="absolute bottom-1/3 -right-24 size-56 rounded-full bg-primary/[0.04] blur-[80px]" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-sm">
        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>
              {error === "access_denied"
                ? "Spotify access was denied. Please try again."
                : "Something went wrong. Please try again."}
            </span>
          </div>
        )}

        {/* Animated audio equalizer bars */}
        <div
          className="flex items-end justify-center gap-1 h-10"
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="audio-bar w-1 rounded-full bg-primary/80"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${1.0 + i * 0.15}s`,
              }}
            />
          ))}
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight leading-[1.1]">
            Share Your <span className="text-primary">Sound</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
            Connect your Spotify account to share what you&apos;re listening to.
          </p>
        </div>

        {/* Connect button */}
        <a
          href="/api/spotify/auth"
          className="inline-flex items-center justify-center h-10 px-6 text-sm font-semibold rounded-full bg-spotify text-white gap-2 shadow-lg shadow-spotify/20 transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:shadow-spotify/30 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spotify focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <SpotifyIcon className="size-4" />
          Connect Spotify
        </a>
      </div>
    </div>
  );
}

