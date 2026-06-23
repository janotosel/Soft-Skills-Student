import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
// Compat AURA : les deux noms d'env existent selon le projet.
const serviceKey =
  process.env.SB_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  // On ne jette pas au chargement pour permettre des tests sans Supabase,
  // mais on prévient bruyamment.
  console.warn(
    "[supabase] SUPABASE_URL ou clé service-role manquante — la persistance échouera.",
  );
}

// Client service-role : bypass RLS. À n'utiliser QUE côté serveur.
export const supabase = createClient(url ?? "", serviceKey ?? "", {
  auth: { persistSession: false, autoRefreshToken: false },
});
