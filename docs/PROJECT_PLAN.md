# Project Plan

## Objective
Build an independent AI Visibility Operating System that closes the loop from AI-answer observation to evidence-backed action and remeasurement.

## Product outcome
A user can onboard a brand, maintain a portfolio of buyer prompts, observe AI answers and citations, compare brand/competitor presence, generate prioritized actions, draft/publish content, ingest AI crawler activity, and measure whether interventions changed visibility.

## Workstreams

### 1. Platform foundation
- organizations, users, projects and RBAC
- configuration and secret management
- usage ledger and billing boundaries
- audit trail and retention controls

### 2. Brand intelligence
- website/sitemap ingestion
- brand/entity/alias extraction
- competitor discovery and governance
- category and market context

### 3. Prompt intelligence
- buyer-prompt generation
- intent taxonomy
- deduplication and semantic clustering
- commercial priority and volume scoring

### 4. Observation engine
- provider-neutral execution contracts
- scheduled runs
- immutable response evidence
- provider/model/run metadata
- quota, retry and cost controls

### 5. Answer and citation intelligence
- brand/competitor mention detection
- answer ordering/rank extraction
- citation URL/domain extraction
- citation gap and recurring-source analysis

### 6. Action engine
- evidence-linked gap detection
- impact scoring
- action lifecycle and approvals
- explainable action briefs

### 7. Content and publishing
- research package
- brief/outline/draft workflow
- CMS adapters
- publication verification
- intervention attribution

### 8. Crawler/search intelligence
- crawler event SDK
- bot verification
- Search Console integration
- AI/search correlation

### 9. Agent/API surface
- scoped REST API keys
- MCP tools
- approval-gated agent actions
- agent-readable evidence briefs

## Milestones

### M0 — Initial draft
Status: implemented in this repository.
- architecture and product docs
- seeded product UI
- domain algorithms and tests
- REST read APIs
- PostgreSQL schema
- durable worker skeleton
- provider/CMS adapter boundaries
- Docker and CI

### M1 — Persistent multi-tenant foundation
Acceptance: authenticated users can create projects and all product screens read/write PostgreSQL safely.

### M2 — Live observation
Acceptance: supported provider runs execute on schedule with traceable evidence, retries, quotas and cost reporting.

### M3 — Evidence intelligence
Acceptance: every metric/action can be traced to source responses/citations and recalculated deterministically.

### M4 — Execution
Acceptance: an approved action can become content and publish through at least one production CMS adapter.

### M5 — Remeasurement
Acceptance: interventions have baselines, post-change runs, and non-causal before/after reporting.

### M6 — Agentic operations
Acceptance: scoped API/MCP tools can investigate evidence and prepare approval-gated actions.

## Definition of done for production
- end-to-end persistent workflows
- no demo-only dependency in production paths
- auth/RBAC and secret encryption
- provider quota and cost controls
- retries/idempotency and job observability
- security review for crawl/webhook/LLM boundaries
- unit, integration and browser E2E tests
- release runbook and rollback procedure
- production monitoring and audit logs
