import { randomBytes } from "crypto";
import { supabase } from "./supabase";

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

  const { error } = await supabase.from("sessions").insert({
    user_id: userId,
    session_token: token,
    expires_at: expiresAt,
  });

  if (error) throw error;
  return token;
}

export async function validateSession(token: string) {
  const { data, error } = await supabase
    .from("sessions")
    .select("user_id, expires_at, users(id, public_id, display_name, spotify_user_id)")
    .eq("session_token", token)
    .single();

  if (error || !data) return null;

  if (new Date(data.expires_at) < new Date()) {
    await supabase.from("sessions").delete().eq("session_token", token);
    return null;
  }

  const user = Array.isArray(data.users) ? data.users[0] : data.users;
  if (!user) return null;

  return {
    userId: user.id as string,
    publicId: user.public_id as string,
    displayName: user.display_name as string | null,
    spotifyUserId: user.spotify_user_id as string,
  };
}

export async function deleteSession(token: string) {
  await supabase.from("sessions").delete().eq("session_token", token);
}

export const SESSION_COOKIE = "session_token";
export const SESSION_MAX_AGE = SESSION_DURATION_MS / 1000; // in seconds
