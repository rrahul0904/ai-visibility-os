# Implementation Plan

## Repository architecture

```text
apps/web       Next.js operator console and REST API
apps/worker    durable background execution
packages/core  provider-neutral analysis, scoring and action logic
packages/db    PostgreSQL access and migrations
docs           product, architecture, API and roadmap
infra          deployment guidance
```

## Phase A — Current implementation
The current branch intentionally supports a deterministic demo store so product behavior can be reviewed without credentials. The same route/component contracts are designed to move to a persistent repository.

Implemented:
- project shell and product navigation
- dashboard, prompts, responses, citations, actions, content and settings
- deterministic response analysis
- visibility/share-of-voice/citation-share calculations
- prompt priority scoring
- evidence-backed action generation
- REST v1 read endpoints and crawler ingest draft
- PostgreSQL relational schema
- job leasing with `FOR UPDATE SKIP LOCKED`
- Anthropic/Perplexity adapter foundations
- CMS adapter contract + webhook adapter
- Docker Compose and GitHub Actions CI
- executable core tests

## Phase B — Persistence and identity
1. Add authentication and organization/project membership.
2. Replace demo store with PostgreSQL repositories.
3. Add migration runner and development seed tooling.
4. Encrypt provider/CMS credentials.
5. Add API-key hashing, scopes and audit events.
6. Add usage ledger and provider-cost records.

## Phase C — Brand and prompt intelligence
1. Crawl domain/sitemap under explicit limits.
2. Extract canonical brand/products/use cases.
3. Add competitor discovery with manual approval.
4. Generate buyer prompts from brand context.
5. Cluster/dedupe prompts.
6. Add versioned priority scoring and market-data adapter.

## Phase D — Live observation
1. Define `ProviderAdapter.run()` contract including model/version, citations, latency and token/cost metadata.
2. Implement permitted provider adapters.
3. Schedule prompt/provider jobs.
4. Persist immutable run/response/citation evidence.
5. Add retries, idempotency, provider rate limits and circuit breakers.
6. Add spend caps per workspace/provider.

## Phase E — Evidence intelligence
1. Version analysis algorithms.
2. Normalize brand aliases/entities.
3. Extract answer order/rank and citations deterministically first.
4. Add semantic disambiguation only where deterministic rules are insufficient.
5. Build recurring-source/citation-gap projections.
6. Store metric snapshots as rebuildable projections.

## Phase F — Action and content execution
1. Add action rules and impact scoring.
2. Link each action to prompts/responses/citations.
3. Add approval states.
4. Create evidence-grounded briefs and drafts.
5. Implement WordPress first, followed by Webflow/Ghost/Shopify/Notion.
6. Verify publication URLs and schedule matched remeasurement jobs.

## Phase G — Crawler/search intelligence
1. Harden server-side crawler SDK.
2. Add bot verification and abuse filtering.
3. Add Google Search Console OAuth.
4. Correlate search traffic with AI visibility without overstating causality.

## Phase H — MCP/agentic interface
Expose read tools first:
- project context
- prompt portfolio
- visibility
- responses
- citations
- citation gaps
- actions
- crawler/search analytics

Then add approval-gated write tools for:
- create action
- create brief/draft
- schedule publication
- rerun prompt portfolio

## Testing strategy
- unit: scoring, extraction and action rules
- integration: PostgreSQL repositories, job lease/retry, API contracts
- contract: provider/CMS adapters
- E2E: onboarding → prompt run → evidence → action → content → remeasurement
- security: SSRF, webhook signatures, prompt injection isolation, credential leakage
- load: high prompt/provider cardinality and crawler-event ingestion

## Immediate next engineering target
Replace the demo store with the PostgreSQL repository implementation while preserving current UI/API contracts. This unlocks authenticated project creation, live job execution and the first truly persistent end-to-end workflow.
