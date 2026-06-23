import { supabase } from "./supabase";

export type Role = "user" | "assistant";
export interface DbMessage {
  role: Role;
  content: string;
}

export interface SessionRow {
  id: string;
  token: string;
  status: string;
  current_phase: number;
  niveau: string | null;
  context: Record<string, unknown>;
}

/** Vérifie qu'une session existe et que le token correspond (garde-fou applicatif). */
export async function authSession(
  sessionId: string,
  token: string,
): Promise<SessionRow | null> {
  if (!sessionId || !token) return null;
  const { data, error } = await supabase
    .from("sessions")
    .select("id, token, status, current_phase, niveau, context")
    .eq("id", sessionId)
    .single();
  if (error || !data) return null;
  if (data.token !== token) return null;
  return data as SessionRow;
}

export async function loadHistory(sessionId: string): Promise<DbMessage[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as DbMessage[];
}

export async function insertMessage(
  sessionId: string,
  role: Role,
  content: string,
): Promise<void> {
  const { error } = await supabase
    .from("messages")
    .insert({ session_id: sessionId, role, content });
  if (error) throw error;
}

export async function countUserTurns(sessionId: string): Promise<number> {
  const { count, error } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId)
    .eq("role", "user");
  if (error) throw error;
  return count ?? 0;
}

export async function updateSession(
  sessionId: string,
  patch: Partial<Pick<SessionRow, "status" | "current_phase">>,
): Promise<void> {
  const { error } = await supabase
    .from("sessions")
    .update(patch)
    .eq("id", sessionId);
  if (error) throw error;
}
