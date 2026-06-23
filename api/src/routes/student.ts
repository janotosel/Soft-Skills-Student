import { Router } from "express";
import {
  createStudent,
  resumeStudent,
  authStudent,
  loadStudentBilans,
} from "../lib/db";

export const studentRouter = Router();

// POST /student — crée un élève pseudonyme, renvoie son code à conserver.
studentRouter.post("/", async (req, res) => {
  try {
    const pseudonym =
      typeof req.body?.pseudonym === "string" ? req.body.pseudonym : undefined;
    const s = await createStudent(pseudonym);
    res.json({
      studentId: s.id,
      token: s.token,
      accessCode: s.access_code,
      pseudonym: s.pseudonym,
    });
  } catch (e) {
    console.error("[student] create error", e);
    res.status(500).json({ error: "Impossible de créer le profil." });
  }
});

// POST /student/resume — { accessCode } -> retrouve l'élève + ses bilans passés.
studentRouter.post("/resume", async (req, res) => {
  const { accessCode } = req.body ?? {};
  if (typeof accessCode !== "string" || !accessCode.trim()) {
    res.status(400).json({ error: "Code manquant." });
    return;
  }
  try {
    const s = await resumeStudent(accessCode);
    if (!s) {
      res.status(404).json({ error: "Code inconnu. Vérifie-le bien." });
      return;
    }
    const bilans = await loadStudentBilans(s.id);
    res.json({
      studentId: s.id,
      token: s.token,
      accessCode: s.access_code,
      pseudonym: s.pseudonym,
      bilans,
    });
  } catch (e) {
    console.error("[student] resume error", e);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// POST /student/timeline — { studentId, token } -> tous les bilans passés.
studentRouter.post("/timeline", async (req, res) => {
  const { studentId, token } = req.body ?? {};
  const s = await authStudent(studentId, token);
  if (!s) {
    res.status(401).json({ error: "Profil invalide." });
    return;
  }
  try {
    const bilans = await loadStudentBilans(s.id);
    res.json({ bilans });
  } catch (e) {
    console.error("[student] timeline error", e);
    res.status(500).json({ error: "Erreur serveur." });
  }
});
