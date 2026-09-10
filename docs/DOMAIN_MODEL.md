# Domain Model

```text
Organization
└─ Project
   ├─ Brand (own)
   ├─ Brands (competitors)
   ├─ Prompt
   │  └─ ProviderRun
   │     └─ Response
   │        └─ Citation
   ├─ VisibilitySnapshot
   ├─ Action ── evidence → Prompt/Response/Citation
   │  └─ Article
   │     └─ Publication
   ├─ CrawlerEvent
   └─ CMSConnection

Jobs coordinate monitoring, analysis refresh, publishing and periodic remeasurement.
```

### Evidence versus projection

**Evidence:** provider run, raw response, raw citation URL, crawler event.

**Projection:** brand rank, share of voice, visibility %, citation share, action score.

Projections should always be recomputable from evidence plus a versioned analysis algorithm.
