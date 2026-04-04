import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  refreshAccessToken,
  getCurrentlyPlaying,
  type TrackData,
} from "@/lib/spotify";
import { getCached, setCache } from "@/lib/cache";
import { buildCurrentlyPlayingSvg } from "@/lib/svg-card";

const CACHE_TTL_MS = 15_000;

interface CachedCard {
  svg: string;
}

async function fetchAlbumArtBase64(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const buffer = await res.arrayBuffer();
    return Buffer.from(buffer).toString("base64");
  } catch {
    return undefined;
  }
}

function svgResponse(svg: string) {
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=15, s-maxage=15, stale-while-revalidate=30",
    },
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ publicId: string }> },
) {
  const { publicId } = await params;
  const cacheKey = `currently-playing:${publicId}`;

  // Check cache
  const cached = getCached<CachedCard>(cacheKey);
  if (cached) {
    return svgResponse(cached.svg);
  }

  // Fetch user + credentials from Supabase
  const { data: user } = await supabase
    .from("users")
    .select("id, display_name, credentials(access_token, refresh_token, token_expires_at)")
    .eq("public_id", publicId)
    .single();

  if (!user || !user.credentials) {
    const svg = buildCurrentlyPlayingSvg("Unknown", null);
    return svgResponse(svg);
  }

  const displayName = user.display_name ?? "Unknown";

  // credentials comes back as an object (unique constraint = single row)
  const cred = Array.isArray(user.credentials)
    ? user.credentials[0]
    : user.credentials;

  if (!cred) {
    const svg = buildCurrentlyPlayingSvg(displayName, null);
    return svgResponse(svg);
  }

  let accessToken = cred.access_token;

  // Refresh token if expired or near-expiry (60s buffer)
  const expiresAt = new Date(cred.token_expires_at).getTime();
  if (Date.now() > expiresAt - 60_000) {
    try {
      const refreshed = await refreshAccessToken(cred.refresh_token);
      accessToken = refreshed.access_token;

      const newExpiresAt = new Date(
        Date.now() + refreshed.expires_in * 1000,
      ).toISOString();

      await supabase
        .from("credentials")
        .update({
          access_token: refreshed.access_token,
          refresh_token: refreshed.refresh_token ?? cred.refresh_token,
          token_expires_at: newExpiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    } catch {
      // Token refresh failed — user may have revoked access
      const svg = buildCurrentlyPlayingSvg(displayName, null);
      return svgResponse(svg);
    }
  }

  // Fetch currently playing
  let track: TrackData | null = null;
  try {
    track = await getCurrentlyPlaying(accessToken);
  } catch {
  }

  // Fetch album art and convert 
  let albumArtBase64: string | undefined;
  if (track?.albumArtUrl) {
    albumArtBase64 = await fetchAlbumArtBase64(track.albumArtUrl);
  }

  const svg = buildCurrentlyPlayingSvg(displayName, track, albumArtBase64);

  setCache(cacheKey, { svg }, CACHE_TTL_MS);

  return svgResponse(svg);
}
