// ============================================================
// PROTECCIÓN DEL PANEL (Vercel Edge Middleware)
// Muestra una PANTALLA DE LOGIN propia (usuario + contraseña).
// Aunque encuentren el link, sin la clave no ven nada.
//
// La clave NO está en el código: se lee de variables de entorno.
// En Vercel → Project → Settings → (entorno Production) → Environment
// Variables, creá:
//     PANEL_USER = luca
//     PANEL_PASS = una-clave-larga-y-privada
// y hacé Redeploy. Si no están seteadas, el panel queda bloqueado.
// ============================================================
export const config = { matcher: '/:path*' };

const COOKIE = 'redi_auth';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 días

export default async function middleware(request) {
  const USER = process.env.PANEL_USER;
  const PASS = process.env.PANEL_PASS;
  const url = new URL(request.url);

  if (!USER || !PASS) {
    return html(lockedPage(), 503);
  }

  const token = await sign(USER, PASS);

  // --- Logout ---
  if (url.pathname === '/__logout') {
    return new Response(null, {
      status: 302,
      headers: { 'Location': '/', 'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; SameSite=Lax` }
    });
  }

  // --- Envío del formulario de login ---
  if (request.method === 'POST' && url.pathname === '/__login') {
    let u = '', p = '';
    try { const form = await request.formData(); u = form.get('user') || ''; p = form.get('pass') || ''; } catch (e) {}
    if (u === USER && p === PASS) {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/',
          'Set-Cookie': `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`
        }
      });
    }
    return html(loginPage(true), 401);
  }

  // --- ¿Ya tiene sesión válida? ---
  if (getCookie(request.headers.get('cookie'), COOKIE) === token) {
    return; // autorizado → deja pasar al panel
  }

  // --- Sin sesión → pantalla de login ---
  return html(loginPage(false), 401);
}

// Firma HMAC-SHA256 del usuario con la contraseña como clave (para la cookie).
async function sign(user, pass) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode('redi:' + user));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function getCookie(header, name) {
  if (!header) return '';
  const m = header.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : '';
}

function html(body, status) {
  return new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

function shell(inner) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Redi — Acceso</title><style>
  *{box-sizing:border-box} html,body{height:100%;margin:0}
  body{background:#050403;color:#F7F5F2;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;display:grid;place-items:center;padding:24px}
  .box{width:100%;max-width:340px;background:#111110;border-radius:6px;box-shadow:0 12px 40px rgba(0,0,0,.5);padding:30px 26px}
  .mk{display:flex;align-items:center;gap:11px;margin-bottom:22px}
  .mk svg{width:30px;height:30px}
  .mk b{font-size:19px;letter-spacing:-.02em}
  .mk small{display:block;font-family:ui-monospace,Menlo,monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#6E6862;margin-top:4px}
  label{font-family:ui-monospace,Menlo,monospace;font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:#A8A29B;display:block;margin:14px 0 6px}
  input{width:100%;background:#1A1917;border:0;border-radius:3px;color:#F7F5F2;padding:11px 12px;font-size:14px;font-family:inherit}
  input:focus{outline:none;box-shadow:inset 0 0 0 1px #EE2B24}
  button{width:100%;margin-top:22px;background:#EE2B24;color:#F7F5F2;border:0;padding:12px;font-family:ui-monospace,Menlo,monospace;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.06em;cursor:pointer;clip-path:polygon(8px 0,100% 0,100% 100%,0 100%,0 8px)}
  button:hover{background:#FF3A32}
  .err{background:rgba(238,43,36,.13);color:#EE2B24;font-size:12px;border-radius:3px;padding:9px 11px;margin-top:16px}
  </style></head><body><div class="box">
  <div class="mk"><svg viewBox="0 0 120 126" fill="#EE2B24"><path d="M12 40 L30 18 L38 30 L38 116 L12 116 Z"/><path d="M44 18 L60 18 L104 63 L60 116 L44 116 L78 63 Z"/></svg><div><b>Redi</b><small>Cerebro de RedLabs</small></div></div>
  ${inner}</div></body></html>`;
}

function loginPage(error) {
  return shell(`<form method="POST" action="/__login" autocomplete="off">
    <label>Usuario</label><input name="user" autofocus>
    <label>Contraseña</label><input name="pass" type="password">
    ${error ? '<div class="err">Usuario o contraseña incorrectos.</div>' : ''}
    <button type="submit">Ingresar</button>
  </form>`);
}

function lockedPage() {
  return shell(`<div class="err">Panel bloqueado. Faltan configurar las variables PANEL_USER y PANEL_PASS en Vercel.</div>`);
}
