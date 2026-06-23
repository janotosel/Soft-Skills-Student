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
  disclaimer: string;
}

export async function createSession(): Promise<Session> {
  const res = await fetch(`${API_URL}/session`, { method: "POST" });
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
