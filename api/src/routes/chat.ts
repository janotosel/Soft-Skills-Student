import { Router } from "express";
import { anthropic, CHAT_MODEL } from "../lib/anthropic";
import { buildSystemPrompt } from "../lib/prompt";
import { phaseForUserTurns } from "../lib/phases";
import {
  authSession,
  loadHistory,
  insertMessage,
  countUserTurns,
  updateSession,
} from "../lib/db";

export const chatRouter = Router();

// POST /chat — { sessionId, token, message } -> stream SSE de la réponse de l'agent.
chatRouter.post("/", async (req, res) => {
  const { sessionId, token, message } = req.body ?? {};

  const session = await authSession(sessionId, token);
  if (!session) {
    res.status(401).json({ error: "Session invalide." });
    return;
  }
  if (typeof message !== "string" || !message.trim()) {
    res.status(400).json({ error: "Message vide." });
    return;
  }

  try {
    // Persiste le message de l'élève, puis recalcule la phase.
    await insertMessage(sessionId, "user", message.trim());
    const userTurns = await countUserTurns(sessionId);
    const phase = phaseForUserTurns(userTurns);

    const history = await loadHistory(sessionId);
    const messages = history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // En-têtes SSE.
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    let full = "";
    const stream = anthropic.messages.stream({
      model: CHAT_MODEL,
      max_tokens: 1024,
      system: buildSystemPrompt(phase),
      messages,
    });

    stream.on("text", (delta) => {
      full += delta;
      res.write(`event: delta\ndata: ${JSON.stringify({ text: delta })}\n\n`);
    });

    stream.on("error", (err) => {
      console.error("[chat] stream error", err);
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: "stream" })}\n\n`,
      );
      res.end();
    });

    await stream.finalMessage();

    // Persiste la réponse de l'agent + met à jour la phase de la session.
    await insertMessage(sessionId, "assistant", full);
    await updateSession(sessionId, { current_phase: phase });

    // Signale au front la phase atteinte (pour proposer le récap en phase 4).
    res.write(`event: done\ndata: ${JSON.stringify({ phase })}\n\n`);
    res.end();
  } catch (e) {
    console.error("[chat] error", e);
    if (!res.headersSent) {
      res.status(500).json({ error: "Erreur serveur." });
    } else {
      res.write(`event: error\ndata: ${JSON.stringify({ error: "server" })}\n\n`);
      res.end();
    }
  }
});
