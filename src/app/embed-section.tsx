"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function EmbedSection({ cardUrl }: { cardUrl: string }) {
  const [copied, setCopied] = useState(false);

  const snippet = `![Currently Playing](${cardUrl})`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <div className="w-full">
      {/* Code block */}
      <div className="relative group">
        <pre className="bg-muted/30 border border-border/50 rounded-lg p-4 pr-14 overflow-x-auto">
          <code className="text-[12.5px] leading-relaxed text-muted-foreground font-mono break-all whitespace-pre-wrap">
            {snippet}
          </code>
        </pre>

        {/* Integrated copy button */}
        <button
          onClick={handleCopy}
          className={`
            absolute top-2.5 right-2.5 p-1.5 rounded-md transition-all cursor-pointer
            ${
              copied
                ? "bg-spotify/15 text-spotify"
                : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/60 opacity-0 group-hover:opacity-100"
            }
          `}
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>

      {/* Hint */}
      <p className="text-[11px] text-muted-foreground/40 mt-2">
        {copied ? (
          <span className="text-spotify/80">Copied to clipboard</span>
        ) : (
          "Paste into your GitHub README to show what you're listening to"
        )}
      </p>
    </div>
  );
}
