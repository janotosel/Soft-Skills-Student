import OpenAI from "openai";

// IA via OpenRouter (API compatible OpenAI). Modèle Kimi par défaut.
// Surchargeable via AI_MODEL (ex: 'moonshotai/kimi-k2-0905').
export const AI_MODEL = process.env.AI_MODEL || "moonshotai/kimi-k2";

// On accepte plusieurs noms de variable pour la clé OpenRouter.
const apiKey =
  process.env.OPENROUTER_API_KEY ||
  process.env.OPENROUTER_KEY ||
  process.env.OPENROUTER ||
  process.env.OPENAI_API_KEY ||
  "";

if (!apiKey) {
  // On ne jette PAS au démarrage (sinon le conteneur crash en boucle) :
  // le serveur boote, et les requêtes IA échoueront avec un message clair.
  console.warn(
    "[ai] Aucune clé OpenRouter trouvée (OPENROUTER_API_KEY). Les appels IA échoueront.",
  );
}

export const ai = new OpenAI({
  apiKey: apiKey || "MISSING_OPENROUTER_KEY",
  baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "X-Title": "Soft Skills Student",
  },
});
