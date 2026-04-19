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
    child.on("close", (code) => resolve({ code, stdout, stderr, child }));
  });
}

async function removeEnvIfExists(key) {
  const result = await run("cmd.exe", ["/d", "/s", "/c", `npx vercel env rm ${key} production -y`]);
  if (result.code !== 0 && !/Could not find|does not exist|not found/i.test(result.stdout + result.stderr)) {
    throw new Error(`Failed removing ${key}`);
  }
}

async function addEnv(key, value) {
  await new Promise((resolve, reject) => {
    const child = spawn("cmd.exe", ["/d", "/s", "/c", `npx vercel env add ${key} production`], {
      cwd: __dirname,
      stdio: ["pipe", "pipe", "pipe"],
      shell: false,
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

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Failed adding ${key}: ${stdout}\n${stderr}`));
        return;
      }
      resolve();
    });

    child.stdin.write(value);
    child.stdin.end();
  });
}

async function main() {
  const env = readEnv(".env");

  const stableNextAuthUrl = "https://web-asim-garhys-projects.vercel.app";
  const values = {
    DATABASE_URL: env.DATABASE_URL,
    NEXTAUTH_SECRET: env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: stableNextAuthUrl,
  };

  for (const [key, value] of Object.entries(values)) {
    if (!value) {
      throw new Error(`Missing local value for ${key}`);
    }

    console.log(`\n--- Resetting ${key} ---`);
    await removeEnvIfExists(key);
    await addEnv(key, value);
    console.log(`--- ${key} updated ---`);
  }
}

main().catch((error) => {
  console.error(error.message || String(error));
  process.exit(1);
});
