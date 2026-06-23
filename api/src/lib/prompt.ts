import { phaseGuide, type Phase } from "./phases";
import { BASE_SYSTEM_PROMPT } from "./systemPrompt";
import type { PastBilan } from "./db";

const BASE = BASE_SYSTEM_PROMPT;

function frenchDate(iso: string): string {
  // Format simple AAAA-MM -> "mois AAAA" sans dépendance externe.
  const d = new Date(iso);
  const mois = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ];
  return `${mois[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Condense les bilans passés en quelques lignes (au plus les 3 derniers). */
export function formatPastBilans(bilans: PastBilan[]): string {
  if (bilans.length === 0) return "";
  return bilans
    .slice(-3)
    .map((b, i) => {
      const p = b.payload as {
        moteurs_principaux?: { moteur: string }[];
        ce_que_jai_entendu?: string[];
      };
      const moteurs = (p.moteurs_principaux ?? [])
        .map((m) => m.moteur)
        .join(", ");
      const points = (p.ce_que_jai_entendu ?? []).slice(0, 2).join(" / ");
      return `Bilan ${i + 1} (${frenchDate(b.created_at)}) — Moteurs : ${moteurs || "n.c."}. Points : ${points || "n.c."}`;
    })
    .join("\n");
}

/** Construit le system prompt complet : base + phase courante + (optionnel) bilans passés. */
export function buildSystemPrompt(phase: Phase, pastBilansText = ""): string {
  const longitudinal = pastBilansText
    ? `\n\n---\n## SUIVI LONGITUDINAL (contexte coulisse — ne jamais réciter mécaniquement)
Cet·te élève a déjà fait un ou plusieurs bilans :
${pastBilansText}

CONSIGNES de suivi :
- Sers-toi de ces bilans pour RELANCER et approfondir, jamais pour ENFERMER. Un ado change, c'est normal et c'est sain.
- Tu peux confronter en douceur ("L'an dernier, ce qui ressortait c'était plutôt X — est-ce que ça te parle encore, ou ça a bougé ?").
- Valorise l'évolution et les nuances ; ne pousse JAMAIS à la cohérence avec le passé.
- Ne déballe pas tout le bilan passé d'un coup ; amène-le par petites touches, au fil de la conversation.`
    : "";
  return `${BASE}\n\n---\n## PHASE COURANTE (instruction dynamique, invisible pour l'élève)\n${phaseGuide(phase)}${longitudinal}`;
}

/** Instruction pour /generate-summary : force une sortie JSON structurée (§6). */
export function buildSummaryInstruction(pastBilansText = ""): string {
  const evolutionField = pastBilansText
    ? `\n  "evolution": "1-3 phrases qui relient ce bilan aux précédents : ce qui reste stable, ce qui a bougé, sans juger ni forcer la cohérence. Ancré dans des éléments concrets des deux bilans.",`
    : "";

  return `${pastBilansText ? `Bilans précédents de cet·te élève (pour situer l'évolution) :\n${pastBilansText}\n\n` : ""}À partir de la conversation ci-dessus, génère le RÉCAP FINAL pour l'élève.

Contraintes ABSOLUES :
- Tout point doit être ancré dans ce que l'élève a RÉELLEMENT dit (cite ou reformule). Auto-check anti-Barnum : si une phrase pourrait s'appliquer à n'importe quel ado, reformule-la ou supprime-la.
- AUCUN score, pourcentage, "profil type", classement de métiers, ni affirmation péremptoire sur l'avenir.
- Pistes formulées en hypothèses, TOUJOURS plusieurs, reliées aux deux horizons (spécialités de première + voies post-bac).${pastBilansText ? "\n- Pour l'évolution : compare aux bilans passés sans juger ; un changement n'est pas une incohérence, c'est une info utile." : ""}
- Si la conversation a été trop courte ou a basculé sur un sujet de détresse, renvoie un récap minimal honnête plutôt que d'inventer.

Réponds UNIQUEMENT avec un objet JSON valide (aucun texte autour, pas de bloc \`\`\`), de la forme :
{
  "ce_que_jai_entendu": ["point spécifique 1", "point spécifique 2", "point spécifique 3"],
  "moteurs_principaux": [
    { "moteur": "nom simple du moteur", "illustration": "l'exemple précis donné par l'élève" }
  ],
  "pistes": {
    "specialites_premiere": ["spé 1", "spé 2"],
    "voies_post_bac": ["voie 1", "voie 2", "voie 3"]
  },
  "pour_aller_plus_loin": ["action concrète 1", "action concrète 2"],${evolutionField}
  "disclaimer": "Ce récap, c'est un point de départ pour réfléchir, pas une décision. La suite t'appartient — et tes proches et tes profs sont là pour ça."
}`;
}
