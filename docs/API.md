# REST API v1

Base: `/api/v1`

| Method | Path | Purpose |
|---|---|---|
| GET | `/project` | Project/brand configuration |
| GET | `/prompts` | Buyer prompt portfolio |
| GET | `/responses` | Captured answer evidence |
| GET | `/citations` | Citation/source evidence |
| GET | `/visibility` | Current metric projection |
| GET | `/actions` | Evidence-backed recommendations |
| GET | `/articles` | Content workflow |
| GET/POST | `/crawler-events` | AI crawler telemetry |

Internal demo orchestration: `POST /api/internal/monitor` with optional Bearer `INTERNAL_JOB_SECRET`.

## Future production conventions

- `/api/v1/projects/:projectId/...`
- cursor pagination (`after`, `limit`)
- `Idempotency-Key` on writes
- `ETag` for large read endpoints
- scoped API key permissions (`read:responses`, `write:articles`, etc.)
- consistent problem-details error format
- per-key and per-project quotas
