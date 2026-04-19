const baseUrl = 'https://clinicallnew.vercel.app';

function parseSetCookie(setCookieHeader) {
  if (!setCookieHeader) return '';
  if (typeof setCookieHeader === 'string') return setCookieHeader.split(';')[0];
  if (Array.isArray(setCookieHeader)) return setCookieHeader.map((v) => v.split(';')[0]).join('; ');
  return '';
}

async function main() {
  const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`, {
    redirect: 'manual',
    headers: {
      'accept': 'application/json'
    }
  });

  const csrfText = await csrfRes.text();
  console.log('CSRF_STATUS=' + csrfRes.status);
  console.log(csrfText);

  let csrfToken = '';
  try {
    csrfToken = JSON.parse(csrfText).csrfToken;
  } catch (err) {
    console.error('Failed to parse CSRF JSON');
    process.exit(1);
  }

  const cookie = parseSetCookie(csrfRes.headers.get('set-cookie'));

  const body = new URLSearchParams({
    csrfToken,
    email: 'superadmin@clinicall.demo',
    password: 'demo1234',
    callbackUrl: `${baseUrl}/dashboard`,
    json: 'true'
  });

  const signInRes = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': cookie,
      'accept': 'application/json'
    },
    body
  });

  const signInText = await signInRes.text();
  console.log('SIGNIN_STATUS=' + signInRes.status);
  console.log(signInText);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
