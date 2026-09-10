# Vercel deployment

The web app can deploy independently to Vercel from `apps/web` or from the monorepo root with workspace build settings.

Recommended production topology:
- Vercel: Next.js web/API
- Managed PostgreSQL: Neon/Supabase/RDS-compatible Postgres
- Worker: container runtime (Railway/Render/Fly/Kubernetes/Cloud Run) because durable polling workers should not live in request-only functions
- Object storage: S3/R2-compatible bucket

Required web environment variables are documented in `.env.example`.
