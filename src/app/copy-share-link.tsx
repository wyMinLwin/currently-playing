"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyShareLink({ text }: { text: string }) {
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
