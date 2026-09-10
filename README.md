# AI Visibility OS

A clean-room implementation of an **AI visibility intelligence + execution platform**. It monitors buyer prompts across AI-answer providers, stores answer evidence and citations, measures brand/competitor visibility, converts gaps into prioritized actions, and provides an article/publishing workflow.

> This repository is an independent implementation based on publicly observable product patterns. It does not contain copied proprietary code, private APIs, or bypass mechanisms from any third-party service.

## What is included

- Multi-page operator UI: Overview, Prompts, Responses, Citations, Actions, Content, Settings
- Provider-neutral monitoring engine with deterministic mock mode and live adapter contracts
- Brand mention, share-of-voice, first-position, citation-share, and opportunity scoring
- Evidence-backed action generation
- REST endpoints for projects, prompts, responses, citations, visibility, actions, articles, and crawler events
- PostgreSQL schema + migrations
- Durable PostgreSQL job worker with retry/lease model
- CMS adapter contracts for WordPress/Webflow/Ghost/Shopify/Notion/webhooks
- AI crawler event ingestion model
- Docker Compose for local Postgres + web + worker
- CI and executable core tests
- Architecture, API, domain-model, implementation roadmap, and clean-room notes

## Quick start

```bash
cp .env.example .env
npm install
npm test
npm run dev
```

Open `http://localhost:3000`.

The web app runs in deterministic **demo mode** when `DATABASE_URL` is not configured. Configure PostgreSQL and run the migration to use persistent data.

```bash
docker compose up -d db
psql "$DATABASE_URL" -f packages/db/migrations/001_init.sql
npm run dev
```

## Repository structure

```text
apps/
  web/       Next.js UI + REST API
  worker/    durable background job consumer
packages/
  core/      scoring, analysis, action generation, provider abstractions
  db/        PostgreSQL access + migrations
scripts/     repo validation
infra/       deployment notes
.docs/       product/architecture/API docs
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/ROADMAP.md`](docs/ROADMAP.md).
