import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { exchangeCodeForTokens, getSpotifyProfile } from "@/lib/spotify";
import { supabase } from "@/lib/supabase";
import { createSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? request.url;
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  if (error || !code) {
    return NextResponse.redirect(
      new URL("/connect?error=access_denied", baseUrl),
    );
  }

  // Validate OAuth state to prevent CSRF
  const storedState = request.cookies.get("oauth_state")?.value;
  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(
      new URL("/connect?error=invalid_state", baseUrl),
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const profile = await getSpotifyProfile(tokens.access_token);

    const expiresAt = new Date(
      Date.now() + tokens.expires_in * 1000,
    ).toISOString();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, public_id")
      .eq("spotify_user_id", profile.id)
      .single();

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;

      await supabase
        .from("users")
        .update({
          display_name: profile.display_name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      // Upsert credentials
      await supabase
        .from("credentials")
        .upsert(
          {
            user_id: userId,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            token_expires_at: expiresAt,
            scope: tokens.scope,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );
    } else {
      // nanoid for public_id
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert({
          public_id: nanoid(12),
          spotify_user_id: profile.id,
          display_name: profile.display_name,
        })
        .select("id")
        .single();

      if (userError || !newUser) {
        throw userError ?? new Error("Failed to create user");
      }

      userId = newUser.id;

      const { error: credError } = await supabase
        .from("credentials")
        .insert({
          user_id: userId,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expires_at: expiresAt,
          scope: tokens.scope,
        });

      if (credError) throw credError;
    }

    const sessionToken = await createSession(userId);

    const response = NextResponse.redirect(new URL("/", baseUrl));
    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    
    // Clear the OAuth state cookie
    response.cookies.delete("oauth_state");
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("OAuth callback error:", message);
    return NextResponse.redirect(
      new URL("/connect?error=server_error", baseUrl),
    );
  }
}
