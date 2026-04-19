const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

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

async function main() {
  const pulledEnv = readEnv(".vercel/env.production.local");
  const env = {
    ...process.env,
    ...pulledEnv,
  };

  const child = spawn("cmd.exe", ["/d", "/s", "/c", "npm run db:seed"], {
    cwd: __dirname,
    env,
    stdio: "inherit",
    shell: false,
  });

  child.on("exit", (code) => {
    process.exit(code ?? 1);
  });

  child.on("error", (error) => {
    console.error(error);
    process.exit(1);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
