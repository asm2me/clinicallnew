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

    env[key] = value.replace(/\r/g, "").trim();
  }

  return env;
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: __dirname,
      stdio: ["pipe", "pipe", "pipe"],
      shell: false,
      ...options,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdout += text;
      process.stdout.write(text);
    });

    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr += text;
      process.stderr.write(text);
    });

    child.on("error", reject);
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

async function removeEnvIfExists(key, target = "production") {
  const result = await run("cmd.exe", [
    "/d",
    "/s",
    "/c",
    `npx vercel env rm ${key} ${target} -y`,
  ]);
  const combined = `${result.stdout}\n${result.stderr}`;

  if (result.code !== 0 && !/Could not find|does not exist|not found/i.test(combined)) {
    throw new Error(`Failed removing ${key} from ${target}: ${combined}`);
  }
}

async function addEnv(key, value, target = "production") {
  await new Promise((resolve, reject) => {
    const child = spawn(
      "cmd.exe",
      ["/d", "/s", "/c", `npx vercel env add ${key} ${target}`],
      {
        cwd: __dirname,
        stdio: ["pipe", "pipe", "pipe"],
        shell: false,
      }
    );

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdout += text;
      process.stdout.write(text);
    });

    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr += text;
      process.stderr.write(text);
    });

    child.on("error", reject);

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Failed adding ${key} to ${target}: ${stdout}\n${stderr}`));
        return;
      }
      resolve();
    });

    child.stdin.write(String(value));
    child.stdin.end();
  });
}

async function upsertEnv(key, value, target = "production") {
  if (!value) {
    throw new Error(`Missing value for ${key}`);
  }

  console.log(`\n--- Resetting ${key} (${target}) ---`);
  await removeEnvIfExists(key, target);
  await addEnv(key, value, target);
  console.log(`--- ${key} updated (${target}) ---`);
}

async function main() {
  const productionEnv = readEnv("temp_production_env.txt");
  const vercelProductionEnv = readEnv(".vercel/env.production.local");

  const pooledDatabaseUrl = vercelProductionEnv.DATABASE_URL || productionEnv.DATABASE_URL;
  const directUrl =
    productionEnv.DIRECT_URL || vercelProductionEnv.DIRECT_URL || pooledDatabaseUrl;

  const values = {
    DATABASE_URL: pooledDatabaseUrl,
    DIRECT_URL: directUrl,
    NEXTAUTH_SECRET: productionEnv.NEXTAUTH_SECRET || vercelProductionEnv.NEXTAUTH_SECRET,
    NEXTAUTH_URL:
      productionEnv.NEXTAUTH_URL ||
      vercelProductionEnv.NEXTAUTH_URL ||
      "https://web-asim-garhys-projects.vercel.app",
  };

  for (const [key, value] of Object.entries(values)) {
    await upsertEnv(key, value, "production");
  }

  console.log("\nProduction environment variables repaired.");
}

main().catch((error) => {
  console.error(error.message || String(error));
  process.exit(1);
});
