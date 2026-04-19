const fs = require("fs");
const path = require("path");

function readEnv(filePath) {
  const fullPath = path.resolve(__dirname, filePath);
  const raw = fs.readFileSync(fullPath, "utf8");
  const env = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function summarizeUrl(value) {
  if (!value) return { present: false };

  try {
    const url = new URL(value);
    return {
      present: true,
      host: url.hostname,
      port: url.port || "(default)",
      db: url.pathname.replace(/^\//, ""),
      search: url.search || "(none)"
    };
  } catch {
    return { present: true, parseError: true };
  }
}

const localEnv = readEnv(".env");
const vercelEnv = readEnv(".vercel/env.production.local");

const localDb = localEnv.DATABASE_URL || "";
const vercelDb = vercelEnv.DATABASE_URL || "";
const localNextAuthUrl = localEnv.NEXTAUTH_URL || "";
const vercelNextAuthUrl = vercelEnv.NEXTAUTH_URL || "";

console.log("DATABASE_URL_EQUAL=" + String(localDb === vercelDb));
console.log("NEXTAUTH_URL_EQUAL=" + String(localNextAuthUrl === vercelNextAuthUrl));
console.log("VERCEL_HAS_NEXTAUTH_SECRET=" + String(Boolean(vercelEnv.NEXTAUTH_SECRET)));

const localDbSummary = summarizeUrl(localDb);
const vercelDbSummary = summarizeUrl(vercelDb);

console.log("LOCAL_DB_SUMMARY=" + JSON.stringify(localDbSummary));
console.log("VERCEL_DB_SUMMARY=" + JSON.stringify(vercelDbSummary));
