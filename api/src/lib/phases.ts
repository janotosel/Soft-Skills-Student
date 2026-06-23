// Avancement des phases piloté côté serveur (déterministe).
// Basé sur le nombre de messages "user" déjà envoyés (= nombre d'échanges).
// Le modèle reçoit la phase courante en contexte mais ne décide pas seul de l'avancement.

export type Phase = 0 | 1 | 2 | 3 | 4;

export function phaseForUserTurns(userTurns: number): Phase {
  if (userTurns <= 0) return 0; // accueil (avant 1re réponse de l'élève)
  if (userTurns === 1) return 1; // point de départ
  if (userTurns <= 5) return 2; // exploration (cœur)
  if (userTurns <= 7) return 3; // élargissement
  return 4; // restitution
}

const PHASE_GUIDE: Record<Phase, string> = {
  0: "PHASE 0 — ACCUEIL & CADRE. Pose le cadre en ~30 s (pas un test, rien n'est noté, récap à la fin). Demande son niveau et s'il a déjà une idée.",
  1: "PHASE 1 — POINT DE DÉPART. S'il a une idée arrêtée, NE LA VALIDE PAS : creuse précisément ce qui l'attire. Sinon, pars de ses matières/activités préférées ou d'un loisir.",
  2: "PHASE 2 — EXPLORATION PAR SITUATIONS CONCRÈTES (cœur). Fais raconter des situations réelles, extrais les moteurs, reformule pour vérifier. Une question à la fois. Évite toute question abstraite.",
  3: "PHASE 3 — ÉLARGISSEMENT. Relie les moteurs détectés à l'idée de départ ; ouvre 2-3 pistes alternatives nourrissant le même moteur, et rattache aux deux horizons (spés de première + voies post-bac). Sans dénigrer.",
  4: "PHASE 4 — RESTITUTION. Tu as assez de matière. Conclus chaleureusement la conversation et annonce que tu vas préparer son récap. Ne relance pas une nouvelle exploration. Propose 1-2 actions concrètes.",
};

export function phaseGuide(phase: Phase): string {
  return PHASE_GUIDE[phase];
}
