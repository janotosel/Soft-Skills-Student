import { randomBytes } from "crypto";
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
  student_id: string | null;
}

/** Vérifie qu'une session existe et que le token correspond (garde-fou applicatif). */
export async function authSession(
  sessionId: string,
  token: string,
): Promise<SessionRow | null> {
  if (!sessionId || !token) return null;
  const { data, error } = await supabase
    .from("sessions")
    .select("id, token, status, current_phase, niveau, context, student_id")
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

// ---------------------------------------------------------------------------
// Suivi longitudinal — élèves & bilans passés
// ---------------------------------------------------------------------------

export interface StudentRow {
  id: string;
  token: string;
  access_code: string;
  pseudonym: string | null;
}

export interface PastBilan {
  created_at: string;
  payload: Record<string, unknown>;
}

// Alphabet sans caractères ambigus (pas de 0/O/1/I).
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCode(): string {
  const bytes = randomBytes(8);
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
    if (i === 3) out += "-"; // format XXXX-XXXX
  }
  return out;
}

/** Crée un élève pseudonyme et renvoie son code + token. Réessaie si collision de code. */
export async function createStudent(
  pseudonym?: string,
): Promise<StudentRow> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const access_code = randomCode();
    const { data, error } = await supabase
      .from("students")
      .insert({ access_code, pseudonym: pseudonym?.trim() || null })
      .select("id, token, access_code, pseudonym")
      .single();
    if (!error && data) return data as StudentRow;
    // 23505 = unique_violation (code déjà pris) → on régénère.
    if (error && (error as { code?: string }).code !== "23505") throw error;
  }
  throw new Error("Impossible de générer un code élève unique.");
}

/** Retrouve un élève par son code et met à jour last_seen_at. */
export async function resumeStudent(
  accessCode: string,
): Promise<StudentRow | null> {
  const code = accessCode.trim().toUpperCase();
  if (!code) return null;
  const { data, error } = await supabase
    .from("students")
    .select("id, token, access_code, pseudonym")
    .eq("access_code", code)
    .single();
  if (error || !data) return null;
  await supabase
    .from("students")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", data.id);
  return data as StudentRow;
}

export async function authStudent(
  studentId: string,
  token: string,
): Promise<StudentRow | null> {
  if (!studentId || !token) return null;
  const { data, error } = await supabase
    .from("students")
    .select("id, token, access_code, pseudonym")
    .eq("id", studentId)
    .single();
  if (error || !data) return null;
  if (data.token !== token) return null;
  return data as StudentRow;
}

/** Rattache une session à un élève. */
export async function linkSessionToStudent(
  sessionId: string,
  studentId: string,
): Promise<void> {
  const { error } = await supabase
    .from("sessions")
    .update({ student_id: studentId })
    .eq("id", sessionId);
  if (error) throw error;
}

/** Bilans passés d'un élève (récaps), du plus ancien au plus récent. */
export async function loadStudentBilans(
  studentId: string,
  excludeSessionId?: string,
): Promise<PastBilan[]> {
  const { data: sessions, error: sErr } = await supabase
    .from("sessions")
    .select("id")
    .eq("student_id", studentId);
  if (sErr) throw sErr;
  const ids = (sessions ?? [])
    .map((s) => s.id as string)
    .filter((id) => id !== excludeSessionId);
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("summaries")
    .select("created_at, payload")
    .in("session_id", ids)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as PastBilan[];
}
