# Soft Skills Student

MVP — outil de bilan soft skills & exploration d'orientation pour lycéens de seconde.
Chat conversationnel guidé par Claude qui aide l'élève à **explorer** ses moteurs et à les relier à des choix d'orientation, **sans jamais poser de verdict**.

> Le risque n°1 de cet outil est éditorial, pas technique : ne pas tomber dans le test de personnalité flatteur. Voir `docs/`.

## Architecture

```
Lycéen (web chat, mobile-first)
  → API Railway  POST /chat          → system prompt + historique + phase → Anthropic (stream)
                 POST /generate-summary → récap structuré (JSON)
  → Supabase (sessions / messages / summaries), RLS verrouillé, mode anonyme
```

- **`web/`** — front Vite + React (consentement RGPD, identité/code de suivi, chat, récap, timeline).
- **`api/`** — API Express (Node/TS) : `/session`, `/chat` (SSE), `/generate-summary`, `/student` (+`/resume`, `/timeline`), `/health`.
- **`supabase/`** — migrations SQL (tables + RLS + élèves) + Edge Function de purge (>30 j, sessions anonymes seulement).
- **`docs/`** — `system-prompt.md` (prompt serveur affiné) et `conversations-test.md` (golden examples).

## Suivi longitudinal (bilan annuel)

L'élève peut créer un **profil pseudonyme** (un surnom optionnel + un **code** à conserver, aucun nom/email).
En revenant chaque année avec son code, il refait le point : l'agent reçoit ses bilans passés en coulisse et
**relance** dessus ("l'an dernier tu disais X, ça a bougé ?") sans jamais l'enfermer. Une **timeline** montre l'évolution,
et le récap inclut un champ *évolution*. Les sessions rattachées à un élève **ne sont pas purgées** (le suivi pluriannuel en dépend).
Les sessions anonymes "one-shot" restent purgées après 30 jours.

## Démarrage local

```bash
# 1. Supabase : appliquer la migration supabase/migrations/0001_init.sql
# 2. API
cp api/.env.example api/.env   # remplir ANTHROPIC_API_KEY, SUPABASE_URL, SB_SERVICE_KEY
npm install
npm run dev:api                # http://localhost:8787
# 3. Front (autre terminal)
cp web/.env.example web/.env   # VITE_API_URL=http://localhost:8787
npm run dev:web                # http://localhost:5173
```

## Déploiement

- **API → Railway** : déployer le dossier `api/` (root directory = `api`). Variables : `ANTHROPIC_API_KEY`, `SUPABASE_URL`, `SB_SERVICE_KEY`, `CORS_ORIGIN` (origine du front). Config dans `api/railway.json`.
- **Front → Railway / Vercel / Netlify** : build `npm run build --workspace=web`, servir `web/dist`. Variable `VITE_API_URL` = URL publique de l'API.
- **Purge RGPD** : déployer `supabase/functions/purge-sessions` (`--no-verify-jwt`) et la planifier (cron quotidien).

## Modèle

Claude Sonnet (`claude-sonnet-4-6`) — bon ratio qualité/latence pour le conversationnel.
System prompt **côté serveur uniquement**, jamais exposé au client.

## Garde-fous

Scope borné à l'orientation, détection de détresse → redirection (psy-EN, CPE, **3018**, **3114**),
mode anonyme, RLS strict, purge auto < 30 jours. Voir `docs/system-prompt.md` §garde-fous.
