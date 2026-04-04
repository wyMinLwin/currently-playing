import { randomBytes } from "crypto";

const TOKEN_URL = "https://accounts.spotify.com/api/token";

function getBasicAuth() {
  return Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");
}

export function generateOAuthState(): string {
  return randomBytes(32).toString("hex");
}

export function getSpotifyAuthUrl(state: string) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    scope: "user-read-currently-playing user-read-playback-state",
    state,
  });
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${getBasicAuth()}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    }),
  });

  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status}`);
  }

  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
  }>;
}

export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${getBasicAuth()}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    throw new Error(`Token refresh failed: ${res.status}`);
  }

  return res.json() as Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  }>;
}

export async function getSpotifyProfile(accessToken: string) {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Profile fetch failed: ${res.status}`);
  }

  return res.json() as Promise<{
    id: string;
    display_name: string | null;
  }>;
}

export interface TrackData {
  isPlaying: boolean;
  trackName: string;
  artistName: string;
  albumName: string;
  albumArtUrl: string;
  progressMs: number;
  durationMs: number;
}

export async function getCurrentlyPlaying(
  accessToken: string,
): Promise<TrackData | null> {
  const res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (res.status === 204 || res.status === 202) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Currently playing fetch failed: ${res.status}`);
  }

  const data = await res.json();

  if (!data.item) {
    return null;
  }

  return {
    isPlaying: data.is_playing,
    trackName: data.item.name,
    artistName: data.item.artists.map((a: { name: string }) => a.name).join(", "),
    albumName: data.item.album.name,
    albumArtUrl: data.item.album.images[0]?.url ?? "",
    progressMs: data.progress_ms ?? 0,
    durationMs: data.item.duration_ms,
  };
}
