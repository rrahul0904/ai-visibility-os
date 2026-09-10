import postgres from "postgres";

let sql;
export function db() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for persistent mode");
  sql ??= postgres(process.env.DATABASE_URL, { max: 10, idle_timeout: 20 });
  return sql;
}

export async function listRows(table, projectId) {
  const allowed = new Set(["projects", "prompts", "responses", "citations", "actions", "articles", "crawler_events"]);
  if (!allowed.has(table)) throw new Error("Unsupported table");
  const client = db();
  return projectId
    ? client.unsafe(`select * from ${table} where project_id = $1 order by created_at desc limit 500`, [projectId])
    : client.unsafe(`select * from ${table} order by created_at desc limit 500`);
}

export async function enqueueJob(type, payload, runAt = new Date()) {
  const client = db();
  const [job] = await client`
    insert into jobs (type, payload, run_at)
    values (${type}, ${client.json(payload)}, ${runAt})
    returning *
  `;
  return job;
}

export async function leaseJobs(workerId, limit = 10) {
  const client = db();
  return client.begin(async (tx) => tx`
    with candidates as (
      select id from jobs
      where status in ('queued','retry') and run_at <= now()
      order by run_at asc
      for update skip locked
      limit ${limit}
    )
    update jobs j
    set status='running', leased_by=${workerId}, leased_until=now() + interval '90 seconds', attempts=attempts+1, updated_at=now()
    from candidates c
    where j.id=c.id
    returning j.*
  `);
}
