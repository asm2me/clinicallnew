const baseUrl = "https://web-blush-pi-90.vercel.app";

function getSetCookieArray(headers) {
  if (typeof headers.getSetCookie === "function") {
    return headers.getSetCookie();
  }

  const raw = headers.get("set-cookie");
  if (!raw) return [];

  return raw.split(/,(?=\s*[^;,\s]+=)/g);
}

function updateCookieJar(jar, headers) {
  for (const cookieString of getSetCookieArray(headers)) {
    const [pair] = cookieString.split(";");
    const eqIndex = pair.indexOf("=");
    if (eqIndex === -1) continue;

    const name = pair.slice(0, eqIndex).trim();
    const value = pair.slice(eqIndex + 1).trim();
    jar.set(name, value);
  }
}

function cookieHeader(jar) {
  return Array.from(jar.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

async function timedFetch(label, url, options, jar) {
  const start = Date.now();
  const res = await fetch(url, options);
  const elapsed = Date.now() - start;
  updateCookieJar(jar, res.headers);
  const text = await res.text();

  console.log(`${label}_STATUS=${res.status}`);
  console.log(`${label}_MS=${elapsed}`);
  console.log(`${label}_LOCATION=${res.headers.get("location")}`);
  console.log(`${label}_BODY_PREVIEW=${text.slice(0, 200).replace(/\s+/g, " ")}`);

  return { res, text, elapsed };
}

async function main() {
  const jar = new Map();

  const csrf = await timedFetch(
    "CSRF",
    `${baseUrl}/api/auth/csrf`,
    {
      redirect: "manual",
      headers: {
        accept: "application/json",
      },
    },
    jar
  );

  const csrfToken = JSON.parse(csrf.text).csrfToken;

  await timedFetch(
    "LOGIN",
    `${baseUrl}/api/auth/callback/credentials`,
    {
      method: "POST",
      redirect: "manual",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        accept: "application/json",
        cookie: cookieHeader(jar),
      },
      body: new URLSearchParams({
        csrfToken,
        email: "superadmin@clinicall.demo",
        password: "demo1234",
        callbackUrl: `${baseUrl}/dashboard`,
        json: "true",
      }),
    },
    jar
  );

  await timedFetch(
    "SESSION",
    `${baseUrl}/api/auth/session`,
    {
      redirect: "manual",
      headers: {
        accept: "application/json",
        cookie: cookieHeader(jar),
      },
    },
    jar
  );

  await timedFetch(
    "DASHBOARD",
    `${baseUrl}/dashboard`,
    {
      redirect: "manual",
      headers: {
        accept: "text/html",
        cookie: cookieHeader(jar),
      },
    },
    jar
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
