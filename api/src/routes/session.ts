import { Router } from "express";
import { supabase } from "../lib/supabase";
import {
  insertMessage,
  authStudent,
  linkSessionToStudent,
  loadStudentBilans,
} from "../lib/db";

export const sessionRouter = Router();

// Accueil par défaut (phase 0) — statique, déterministe, aligné sur le system prompt.
const GREETING_NEW =
  "Salut ! On va discuter un quart d'heure de ce qui te plaît et de comment tu fonctionnes. " +
  "Y a pas de bonne ou mauvaise réponse, c'est pas un test, et je note rien sur toi — ça sert juste à te préparer un petit récap à la fin. " +
  "Dis-moi déjà : t'es en seconde, c'est ça ? Et t'as déjà une idée de ce que tu voudrais faire plus tard, ou pas trop ?";

// Accueil "bon retour" pour un élève qui a déjà fait un bilan.
function greetingReturning(lastMoteurs: string[]): string {
  const moteurs = lastMoteurs.slice(0, 2).join(" et ");
  const rappel = moteurs
    ? `La dernière fois, ce qui ressortait surtout c'était ${moteurs}. On va voir si ça te parle encore ou si ça a bougé depuis. `
    : "";
  return (
    "Hey, content de te revoir ! " +
    rappel +
    "Pas de pression, on repart de toi, là, aujourd'hui. Alors, où t'en es en ce moment — y a un truc qui t'occupe l'esprit côté orientation ?"
  );
}

// POST /session — crée une session (anonyme, ou rattachée à un élève) + 1er message.
sessionRouter.post("/", async (req, res) => {
  try {
    const { studentId, token } = req.body ?? {};

    const { data, error } = await supabase
      .from("sessions")
      .insert({ niveau: "seconde_generale" })
      .select("id, token")
      .single();
    if (error || !data) throw error ?? new Error("insert session failed");

    // Rattachement optionnel à un élève (suivi longitudinal).
    let greeting = GREETING_NEW;
    if (studentId && token) {
      const student = await authStudent(studentId, token);
      if (student) {
        await linkSessionToStudent(data.id, student.id);
        const bilans = await loadStudentBilans(student.id);
        if (bilans.length > 0) {
          const last = bilans[bilans.length - 1].payload as {
            moteurs_principaux?: { moteur: string }[];
          };
          const moteurs = (last.moteurs_principaux ?? []).map((m) => m.moteur);
          greeting = greetingReturning(moteurs);
        }
      }
    }

    await insertMessage(data.id, "assistant", greeting);

    res.json({ sessionId: data.id, token: data.token, greeting });
  } catch (e) {
    console.error("[session] create error", e);
    res.status(500).json({ error: "Impossible de créer la session." });
  }
});
