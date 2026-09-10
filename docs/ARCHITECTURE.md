# Technical Architecture

## Goal

Visibility OS is an evidence-first AI-discovery control plane. It does **not** depend on a single answer provider or a single CMS. Provider observations are immutable evidence; derived metrics and actions are rebuildable projections.

## Logical architecture

```text
                         ┌────────────────────────┐
                         │ Next.js operator UI    │
                         │ REST API / future MCP  │
                         └────────────┬───────────┘
                                      │
                          ┌───────────▼────────────┐
                          │ Application services   │
                          │ project/prompt/action  │
                          └───────┬───────┬────────┘
                                  │       │
                         ┌────────▼─┐   ┌─▼─────────────┐
                         │PostgreSQL│   │ Durable jobs   │
                         │evidence  │   │ SKIP LOCKED    │
                         └────┬─────┘   └──────┬────────┘
                              │                │
             ┌────────────────┼────────────────┼───────────────┐
             ▼                ▼                ▼               ▼
      Provider adapters  Search-data      Crawler ingest   CMS adapters
      AI answer APIs     adapters          / SDK            / webhooks
             │
             ▼
      raw answer evidence
             │
             ▼
      deterministic analysis
      mentions/citations/rank
             │
             ▼
      metric projections
             │
             ▼
      gap + action engine
             │
             ▼
      brief/draft/publish
             │
             ▼
      rerun + attribution
```

## Key design decisions

1. **Immutable evidence first.** Raw answers, provider/run identity, citations and timestamps are retained before metrics are derived.
2. **Provider-neutral adapters.** A provider can disappear without invalidating domain models.
3. **Deterministic extraction where possible.** Exact brand aliases, URL/domain parsing and metric math should not consume LLM tokens.
4. **LLMs enrich, not own truth.** Semantic intent/sentiment/entity disambiguation can be model-assisted but always attaches to source evidence.
5. **Durable jobs.** Monitoring and publishing are background jobs with leases, retry and terminal failure states.
6. **Action lineage.** Every action links to prompt IDs, response IDs and citation evidence so an operator can audit why it exists.
7. **Demo/persistent separation.** The UI ships with deterministic seeded data for immediate product review; production persistence uses PostgreSQL.

## Runtime domains

### Web/API
- Next.js App Router
- Server Components for read-heavy operator screens
- Route Handlers for REST
- Node runtime for DB/provider integrations

### Persistence
- PostgreSQL is source of record.
- JSONB is used only for provider-specific/derived payloads that genuinely vary.
- High-value query dimensions remain relational (`project_id`, `prompt_id`, `provider`, `domain`, timestamps).

### Worker
- PostgreSQL job queue for the bootstrap implementation.
- `FOR UPDATE SKIP LOCKED` provides safe multi-worker leasing.
- Can later be moved to SQS/Cloud Tasks/Upstash without changing job contracts.

### Scaling path
- Partition `responses`, `citations`, `crawler_events` by time/project at large scale.
- Move analytical projections to ClickHouse when response/crawler event volume makes PostgreSQL aggregation expensive.
- Cache dashboard rollups, not raw evidence.
- Rate-limit by project/provider and maintain a cost ledger per provider run.

## Security controls to add before public launch

- managed auth + organization membership/RBAC
- envelope encryption for CMS/provider credentials
- scoped API keys stored as hashes
- webhook signature verification
- provider rate limits and spend budgets
- audit log for publication/action state changes
- deletion/retention workflows
- SSRF allowlisting for crawler/CMS webhooks
- prompt-injection isolation for crawled third-party content
