# Implementation Roadmap

## Phase 0 — current repository
- product/architecture specification
- functional seeded UI
- domain algorithms + tests
- REST read API
- PostgreSQL schema
- durable worker skeleton
- provider/CMS adapter boundaries
- Docker + CI

## Phase 1 — production foundation
- auth, organizations, RBAC
- persistent repository implementation
- migrations/seed tooling
- encrypted integration secrets
- billing + usage ledger

## Phase 2 — brand intelligence
- website crawl/sitemap ingestion
- entity and product extraction
- competitor discovery
- brand alias governance

## Phase 3 — prompt intelligence
- prompt generator and taxonomy
- dedupe/semantic clustering
- commercial-intent scoring
- search-volume/market data adapter

## Phase 4 — live provider execution
- ChatGPT/OpenAI-compatible observation strategy where permitted
- Gemini adapter
- Perplexity adapter
- provider/model run metadata
- quota, retry, spend and failure controls

## Phase 5 — answer & citation intelligence
- deterministic mention/rank extraction
- semantic disambiguation
- citation enrichment/title fetch
- recurring-source and citation-gap graph

## Phase 6 — action engine
- versioned rules
- impact scoring
- action lifecycle + approval
- evidence briefs

## Phase 7 — content + publishing
- research package
- outline/draft/review pipeline
- WordPress, Webflow, Ghost, Shopify, Notion
- publication verification

## Phase 8 — crawler + search intelligence
- production crawler SDK
- bot verification
- Google Search Console OAuth
- AI/search correlation views

## Phase 9 — agent API/MCP
- scoped REST tokens
- MCP tools for project context, evidence, visibility and actions
- approval-gated execution tools

## Phase 10 — measurement & scale
- experiment baseline/intervention model
- volatility/stability runs
- model/provider change detection
- ClickHouse analytical plane when needed
- multi-region worker partitioning
