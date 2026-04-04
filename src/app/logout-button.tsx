"use client";

import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="POST">
      <button
        type="submit"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 px-4 rounded-lg hover:bg-foreground/[0.04] cursor-pointer"
      >
        <LogOut className="size-3.5" />
        <span>Disconnect</span>
      </button>
    </form>
  );
}
