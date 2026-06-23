const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8787";

export interface Session {
  sessionId: string;
  token: string;
  greeting: string;
}

export interface Summary {
  ce_que_jai_entendu: string[];
  moteurs_principaux: { moteur: string; illustration: string }[];
  pistes: {
    specialites_premiere: string[];
    voies_post_bac: string[];
  };
  pour_aller_plus_loin: string[];
  evolution?: string;
  disclaimer: string;
}

export interface Bilan {
  created_at: string;
  payload: Summary;
}

export interface Student {
  studentId: string;
  token: string;
  accessCode: string;
  pseudonym: string | null;
  bilans?: Bilan[];
}

// Crée un profil élève pseudonyme (suivi pluriannuel).
export async function createStudent(pseudonym?: string): Promise<Student> {
  const res = await fetch(`${API_URL}/student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pseudonym }),
  });
  if (!res.ok) throw new Error("createStudent failed");
  return res.json();
}

// Retrouve un élève via son code + renvoie ses bilans passés.
export async function resumeStudent(accessCode: string): Promise<Student> {
  const res = await fetch(`${API_URL}/student/resume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessCode }),
  });
  if (res.status === 404) throw new Error("code_inconnu");
  if (!res.ok) throw new Error("resumeStudent failed");
  return res.json();
}

export async function fetchTimeline(student: Student): Promise<Bilan[]> {
  const res = await fetch(`${API_URL}/student/timeline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      studentId: student.studentId,
      token: student.token,
    }),
  });
  if (!res.ok) throw new Error("timeline failed");
  const data = await res.json();
  return data.bilans as Bilan[];
}

// Crée une session, éventuellement rattachée à un élève.
export async function createSession(student?: Student | null): Promise<Session> {
  const res = await fetch(`${API_URL}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      student ? { studentId: student.studentId, token: student.token } : {},
    ),
  });
  if (!res.ok) throw new Error("createSession failed");
  return res.json();
}

/**
 * Envoie un message et stream la réponse de l'agent.
 * @param onDelta  appelé à chaque morceau de texte reçu
 * @returns la phase atteinte (0-4)
 */
export async function streamChat(
  session: Session,
  message: string,
  onDelta: (text: string) => void,
): Promise<number> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: session.sessionId,
      token: session.token,
      message,
    }),
  });
  if (!res.ok || !res.body) throw new Error("chat failed");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let phase = 0;

  // Parse minimal du flux SSE (event: ... / data: ...).
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";

    for (const block of blocks) {
      const lines = block.split("\n");
      const event = lines.find((l) => l.startsWith("event:"))?.slice(6).trim();
      const dataLine = lines.find((l) => l.startsWith("data:"))?.slice(5).trim();
      if (!dataLine) continue;
      const data = JSON.parse(dataLine);
      if (event === "delta") onDelta(data.text);
      else if (event === "done") phase = data.phase;
      else if (event === "error") throw new Error("stream error");
    }
  }
  return phase;
}

export async function generateSummary(session: Session): Promise<Summary> {
  const res = await fetch(`${API_URL}/generate-summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: session.sessionId,
      token: session.token,
    }),
  });
  if (!res.ok) throw new Error("summary failed");
  const data = await res.json();
  return data.summary as Summary;
}
