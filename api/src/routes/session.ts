import { Router } from "express";
import { supabase } from "../lib/supabase";
import { insertMessage } from "../lib/db";

export const sessionRouter = Router();

// Message d'accueil (phase 0) — statique, déterministe, aligné sur le system prompt.
const GREETING =
  "Salut ! On va discuter un quart d'heure de ce qui te plaît et de comment tu fonctionnes. " +
  "Y a pas de bonne ou mauvaise réponse, c'est pas un test, et je note rien sur toi — ça sert juste à te préparer un petit récap à la fin. " +
  "Dis-moi déjà : t'es en seconde, c'est ça ? Et t'as déjà une idée de ce que tu voudrais faire plus tard, ou pas trop ?";

// POST /session — crée une session anonyme et renvoie le 1er message de l'agent.
sessionRouter.post("/", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("sessions")
      .insert({ niveau: "seconde_generale" })
      .select("id, token")
      .single();
    if (error || !data) throw error ?? new Error("insert session failed");

    await insertMessage(data.id, "assistant", GREETING);

    res.json({ sessionId: data.id, token: data.token, greeting: GREETING });
  } catch (e) {
    console.error("[session] create error", e);
    res.status(500).json({ error: "Impossible de créer la session." });
  }
});
