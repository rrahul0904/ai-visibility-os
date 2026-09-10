import fs from "node:fs";
import path from "node:path";

const required = [
  "apps/web/app/page.js",
  "apps/web/app/dashboard/page.js",
  "apps/web/app/api/v1/prompts/route.js",
  "apps/web/app/api/v1/visibility/route.js",
  "apps/worker/src/index.mjs",
  "packages/core/src/index.js",
  "packages/db/migrations/001_init.sql",
  "docs/ARCHITECTURE.md"
];

const missing = required.filter((p) => !fs.existsSync(path.resolve(p)));
if (missing.length) {
  console.error("Missing required project files:\n" + missing.join("\n"));
  process.exit(1);
}

for (const pkgPath of ["package.json", "apps/web/package.json", "apps/worker/package.json", "packages/core/package.json", "packages/db/package.json"]) {
  JSON.parse(fs.readFileSync(pkgPath, "utf8"));
}

console.log(`Project check passed (${required.length} critical files present).`);
