// Edge Function — purge automatique des sessions > 30 jours (RGPD mineur, §10).
// À planifier via un cron (pg_cron ou scheduler externe) appelant cet endpoint.
// Déployer avec : supabase functions deploy purge-sessions --no-verify-jwt
//
// NB (patterns AURA) : Deno.serve natif + import npm:, pas d'esm.sh.

import { createClient } from "npm:@supabase/supabase-js@2";

const RETENTION_DAYS = 30;

Deno.serve(async (_req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SB_SERVICE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();

    // On ne purge QUE les sessions anonymes one-shot (student_id IS NULL).
    // Les sessions rattachées à un élève sont conservées pour le suivi pluriannuel.
    // NB : un usage établissement réel nécessitera consentement parental + registre RGPD (brief §10).
    // messages & summaries partent en cascade via ON DELETE CASCADE.
    const { data, error } = await supabase
      .from("sessions")
      .delete()
      .is("student_id", null)
      .lt("created_at", cutoff)
      .select("id");

    if (error) throw error;

    return new Response(
      JSON.stringify({ purged: data?.length ?? 0, cutoff }),
      { headers: { "content-type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }
});
