import { Router } from "express";
import { anthropic, CHAT_MODEL } from "../lib/anthropic";
import { SUMMARY_INSTRUCTION } from "../lib/prompt";
import { supabase } from "../lib/supabase";
import { authSession, loadHistory, updateSession } from "../lib/db";

export const summaryRouter = Router();

function safeParseJson(text: string): unknown | null {
  // Le modèle est instruit de renvoyer du JSON pur, mais on tolère un bloc ```.
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

// POST /generate-summary — { sessionId, token } -> récap structuré (§6), stocké.
summaryRouter.post("/", async (req, res) => {
  const { sessionId, token } = req.body ?? {};

  const session = await authSession(sessionId, token);
  if (!session) {
    res.status(401).json({ error: "Session invalide." });
    return;
  }

  try {
    const history = await loadHistory(sessionId);
    const transcript = history
      .map((m) => `${m.role === "user" ? "Élève" : "Agent"}: ${m.content}`)
      .join("\n");

    const completion = await anthropic.messages.create({
      model: CHAT_MODEL,
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `Conversation :\n\n${transcript}\n\n${SUMMARY_INSTRUCTION}`,
        },
      ],
    });

    const text = completion.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");

    const payload = safeParseJson(text);
    if (!payload) {
      console.error("[summary] JSON parse failed:", text);
      res.status(502).json({ error: "Récap illisible, réessaie." });
      return;
    }

    await supabase.from("summaries").insert({ session_id: sessionId, payload });
    await updateSession(sessionId, { status: "completed" });

    res.json({ summary: payload });
  } catch (e) {
    console.error("[summary] error", e);
    res.status(500).json({ error: "Erreur serveur." });
  }
});
