-- Migration 0002 — suivi longitudinal de l'élève (bilan annuel).
-- L'élève reste anonyme : il garde un CODE personnel (pas de nom/email) pour revenir.
-- Voir docs/system-prompt.md §suivi longitudinal.

-- Élève pseudonyme : identifié par un code secret qu'il conserve.
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  -- code lisible remis à l'élève pour revenir (ex: 'BRAVO-7K2P'). Généré côté API.
  access_code text not null unique,
  -- secret d'API renvoyé après création/reprise, stocké côté client.
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  -- alias optionnel choisi par l'élève (jamais le vrai nom).
  pseudonym text,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

-- Une session de bilan peut être rattachée à un élève (sinon = one-shot anonyme).
alter table sessions
  add column if not exists student_id uuid references students(id) on delete cascade;
create index if not exists sessions_student_idx on sessions (student_id, created_at);

-- RLS : verrouillage total comme le reste. Accès uniquement via l'API (service-role).
alter table students enable row level security;
