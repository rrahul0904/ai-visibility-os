import crypto from "node:crypto";
import { db, leaseJobs } from "@visibility/db";

const workerId = `worker-${crypto.randomUUID().slice(0, 8)}`;
const client = db();

const handlers = {
  async MONITOR_PROMPT(job) {
    const payload = job.payload;
    if (!payload?.projectId || !payload?.promptId) throw new Error("MONITOR_PROMPT requires projectId and promptId");
    console.log(`[${workerId}] monitoring ${payload.promptId}`);
  },
  async REFRESH_VISIBILITY(job) {
    if (!job.payload?.projectId) throw new Error("REFRESH_VISIBILITY requires projectId");
    console.log(`[${workerId}] refreshing visibility ${job.payload.projectId}`);
  }
};

async function finish(job, error) {
  if (!error) {
    await client`update jobs set status='completed', leased_by=null, leased_until=null, updated_at=now() where id=${job.id}`;
    return;
  }
  const terminal = job.attempts >= job.max_attempts;
  await client`
    update jobs set
      status=${terminal ? "failed" : "retry"},
      last_error=${String(error?.stack || error)},
      leased_by=null,
      leased_until=null,
      run_at=${terminal ? new Date() : new Date(Date.now() + Math.min(60_000, 1000 * 2 ** job.attempts))},
      updated_at=now()
    where id=${job.id}
  `;
}

async function tick() {
  const jobs = await leaseJobs(workerId, 10);
  for (const job of jobs) {
    try {
      const handler = handlers[job.type];
      if (!handler) throw new Error(`Unknown job type: ${job.type}`);
      await handler(job);
      await finish(job);
    } catch (error) {
      console.error(`[${workerId}] job failed`, job.id, error);
      await finish(job, error);
    }
  }
}

console.log(`[${workerId}] started`);
setInterval(() => tick().catch((error) => console.error("worker tick failed", error)), 2000);
await tick();
