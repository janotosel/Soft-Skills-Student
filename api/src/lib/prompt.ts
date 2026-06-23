import { readFileSync } from "fs";
import { resolve } from "path";
import { phaseGuide, type Phase } from "./phases";

function loadBaseSystemPrompt(): string {
  const candidates = [
    process.env.SYSTEM_PROMPT_PATH,
    resolve(__dirname, "../prompts/system.md"),
    resolve(__dirname, "../../src/prompts/system.md"), // depuis dist/
    resolve(process.cwd(), "src/prompts/system.md"),
  ].filter(Boolean) as string[];

  for (const p of candidates) {
    try {
      return readFileSync(p, "utf-8");
    } catch {
      /* essaie le suivant */
    }
  }
  throw new Error(
    "System prompt introuvable. Vérifie api/src/prompts/system.md ou SYSTEM_PROMPT_PATH.",
  );
}

const BASE = loadBaseSystemPrompt();

/** Construit le system prompt complet en injectant la phase courante. */
export function buildSystemPrompt(phase: Phase): string {
  return `${BASE}\n\n---\n## PHASE COURANTE (instruction dynamique, invisible pour l'élève)\n${phaseGuide(phase)}`;
}

/** Instruction pour /generate-summary : force une sortie JSON structurée (§6). */
export const SUMMARY_INSTRUCTION = `À partir de la conversation ci-dessus, génère le RÉCAP FINAL pour l'élève.

Contraintes ABSOLUES :
- Tout point doit être ancré dans ce que l'élève a RÉELLEMENT dit (cite ou reformule). Auto-check anti-Barnum : si une phrase pourrait s'appliquer à n'importe quel ado, reformule-la ou supprime-la.
- AUCUN score, pourcentage, "profil type", classement de métiers, ni affirmation péremptoire sur l'avenir.
- Pistes formulées en hypothèses, TOUJOURS plusieurs, reliées aux deux horizons (spécialités de première + voies post-bac).
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
  "pour_aller_plus_loin": ["action concrète 1", "action concrète 2"],
  "disclaimer": "Ce récap, c'est un point de départ pour réfléchir, pas une décision. La suite t'appartient — et tes proches et tes profs sont là pour ça."
}`;
