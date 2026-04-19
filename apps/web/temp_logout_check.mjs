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

async function getJson(url, jar) {
  const res = await fetch(url, {
    redirect: "manual",
    headers: {
      accept: "application/json",
      cookie: cookieHeader(jar),
    },
  });

  updateCookieJar(jar, res.headers);
  const text = await res.text();

  return {
    status: res.status,
    text,
    json: text ? JSON.parse(text) : null,
  };
}

async function postForm(url, body, jar) {
  const res = await fetch(url, {
    method: "POST",
    redirect: "manual",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      accept: "application/json",
      cookie: cookieHeader(jar),
    },
    body: new URLSearchParams(body),
  });

  updateCookieJar(jar, res.headers);
  const text = await res.text();

  return {
    status: res.status,
    text,
    location: res.headers.get("location"),
  };
}

async function main() {
  const jar = new Map();

  const csrf1 = await getJson(`${baseUrl}/api/auth/csrf`, jar);
  console.log("CSRF1_STATUS=" + csrf1.status);
  console.log("CSRF1_BODY=" + csrf1.text);

  const login = await postForm(`${baseUrl}/api/auth/callback/credentials`, {
    csrfToken: csrf1.json.csrfToken,
    email: "superadmin@clinicall.demo",
    password: "demo1234",
    callbackUrl: `${baseUrl}/dashboard`,
    json: "true",
  }, jar);

  console.log("LOGIN_STATUS=" + login.status);
  console.log("LOGIN_LOCATION=" + login.location);
  console.log("LOGIN_BODY=" + login.text);

  const sessionBeforeLogout = await getJson(`${baseUrl}/api/auth/session`, jar);
  console.log("SESSION_BEFORE_LOGOUT_STATUS=" + sessionBeforeLogout.status);
  console.log("SESSION_BEFORE_LOGOUT_BODY=" + sessionBeforeLogout.text);

  const csrf2 = await getJson(`${baseUrl}/api/auth/csrf`, jar);
  console.log("CSRF2_STATUS=" + csrf2.status);
  console.log("CSRF2_BODY=" + csrf2.text);

  const logout = await postForm(`${baseUrl}/api/auth/signout`, {
    csrfToken: csrf2.json.csrfToken,
    callbackUrl: `${baseUrl}/login`,
    json: "true",
  }, jar);

  console.log("LOGOUT_STATUS=" + logout.status);
  console.log("LOGOUT_LOCATION=" + logout.location);
  console.log("LOGOUT_BODY=" + logout.text);

  const sessionAfterLogout = await getJson(`${baseUrl}/api/auth/session`, jar);
  console.log("SESSION_AFTER_LOGOUT_STATUS=" + sessionAfterLogout.status);
  console.log("SESSION_AFTER_LOGOUT_BODY=" + sessionAfterLogout.text);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
