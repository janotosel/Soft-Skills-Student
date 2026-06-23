-- Migration 0001 — schéma initial du bilan soft skills (MVP anonyme)
-- Voir docs/brief §8 et §10. Mode anonyme : aucune identité réelle stockée.

create extension if not exists pgcrypto;

-- Session de bilan (anonyme au MVP)
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  -- secret partagé avec le client : sert de garde-fou applicatif (l'API tourne en service-role)
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz not null default now(),
  status text not null default 'in_progress',  -- in_progress | completed | abandoned
  current_phase int not null default 0,
  niveau text,                                  -- ex: 'seconde_generale'
  context jsonb not null default '{}'::jsonb     -- idée de départ, moteurs détectés en cours, etc.
);

-- Messages de la conversation
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  role text not null,                            -- 'user' | 'assistant'
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_session_idx on messages (session_id, created_at);

-- Récap final structuré (structure §6)
create table if not exists summaries (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists summaries_session_idx on summaries (session_id);

-- RLS : verrouillage total. Aucun accès anon/public.
-- L'accès se fait UNIQUEMENT via l'API serveur (clé service-role, qui bypass RLS),
-- après vérification du token de session. Voir §10.
alter table sessions  enable row level security;
alter table messages  enable row level security;
alter table summaries enable row level security;

-- Aucune policy permissive => tout accès direct (anon/authenticated) est refusé par défaut.
