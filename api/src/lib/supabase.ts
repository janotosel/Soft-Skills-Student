import { createClient } from "@supabase/supabase-js";

const url =
  process.env.SUPABASE_URL ||
  process.env.SUPABASE_PROJECT_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;
// On accepte plusieurs noms courants pour la clé service-role.
const serviceKey =
  process.env.SB_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SERVICE_ROLE_KEY ||
  process.env.service_role ||
  process.env.service_role_key;

if (!url || !serviceKey) {
  // On NE jette PAS au démarrage (sinon crash-loop sur Railway) : le serveur boote,
  // /health répond, et les requêtes qui touchent la base échoueront avec un message clair.
  console.warn(
    "[supabase] SUPABASE_URL ou clé service-role manquante — la persistance échouera. " +
      "Ajoute SUPABASE_URL (https://<ref>.supabase.co) et SB_SERVICE_KEY dans les variables.",
  );
}

// Fallback d'URL pour éviter que createClient ne jette quand SUPABASE_URL est absente.
const SAFE_URL = url || "https://placeholder.supabase.co";

// Client service-role : bypass RLS. À n'utiliser QUE côté serveur.
export const supabase = createClient(SAFE_URL, serviceKey ?? "placeholder-key", {
  auth: { persistSession: false, autoRefreshToken: false },
});

export const supabaseConfigured = Boolean(url && serviceKey);
