const fs = require('fs');
const path = require('path');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const eqIndex = line.indexOf('=');

    if (eqIndex === -1) {
      continue;
    }

    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(__dirname, '.env'));
loadEnvFile(path.join(__dirname, '.env.local'));

for (const name of ['DATABASE_URL', 'DIRECT_URL']) {
  const value = process.env[name];

  if (!value) {
    console.log(`${name}: missing`);
    continue;
  }

  try {
    const url = new URL(value);
    console.log(
      `${name}: host=${url.hostname} port=${url.port || '(default)'} sslmode=${url.searchParams.get('sslmode') || ''}`,
    );
  } catch {
    console.log(`${name}: invalid url`);
  }
}
