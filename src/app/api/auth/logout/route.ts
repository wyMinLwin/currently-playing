import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { deleteSession, SESSION_COOKIE } from "@/lib/session";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (token) {
    await deleteSession(token);
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? request.url;
  const response = NextResponse.redirect(new URL("/connect", baseUrl));
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
