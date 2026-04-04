import { NextResponse } from "next/server";
import { getSpotifyAuthUrl, generateOAuthState } from "@/lib/spotify";

export async function GET() {
  const state = generateOAuthState();
  const response = NextResponse.redirect(getSpotifyAuthUrl(state));
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return response;
}
