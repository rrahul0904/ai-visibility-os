create extension if not exists pgcrypto;

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  name text not null,
  domain text not null,
  brand_name text not null,
  brand_description text,
  language text not null default 'en',
  target_country_code text not null default 'US',
  timezone text not null default 'America/New_York',
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  name text not null,
  domain text,
  kind text not null check (kind in ('own','competitor')),
  aliases jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists prompts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  text text not null,
  slug text not null,
  intent text not null default 'commercial',
  commercial_intent int not null default 3 check (commercial_intent between 1 and 5),
  volume int not null default 3 check (volume between 1 and 5),
  strategic_fit int not null default 3 check (strategic_fit between 1 and 5),
  providers jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists prompts_project_idx on prompts(project_id, status);

create table if not exists provider_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  prompt_id uuid not null references prompts(id) on delete cascade,
  provider text not null,
  status text not null default 'queued',
  started_at timestamptz,
  completed_at timestamptz,
  latency_ms int,
  error text,
  created_at timestamptz not null default now()
);

create table if not exists responses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  run_id uuid references provider_runs(id) on delete set null,
  prompt_id uuid not null references prompts(id) on delete cascade,
  provider text not null,
  answer text not null,
  analysis jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists responses_project_prompt_idx on responses(project_id, prompt_id, created_at desc);

create table if not exists citations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  response_id uuid not null references responses(id) on delete cascade,
  prompt_id uuid not null references prompts(id) on delete cascade,
  provider text not null,
  url text not null,
  domain text not null,
  title text,
  is_owned boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists citations_project_domain_idx on citations(project_id, domain);

create table if not exists visibility_snapshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  period_start timestamptz not null,
  period_end timestamptz not null,
  dimensions jsonb not null default '{}'::jsonb,
  metrics jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists actions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  prompt_id uuid references prompts(id) on delete set null,
  type text not null,
  priority text not null,
  status text not null default 'open',
  score int not null default 0,
  title text not null,
  objective text,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  action_id uuid references actions(id) on delete set null,
  title text not null,
  slug text not null,
  status text not null default 'idea',
  brief jsonb not null default '{}'::jsonb,
  body text,
  publication jsonb not null default '{}'::jsonb,
  scheduled_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crawler_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  provider text,
  bot text,
  category text,
  path text not null,
  status_code int,
  verification_status text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists cms_connections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  provider text not null,
  encrypted_config text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'queued',
  attempts int not null default 0,
  max_attempts int not null default 5,
  run_at timestamptz not null default now(),
  leased_by text,
  leased_until timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists jobs_ready_idx on jobs(status, run_at);
