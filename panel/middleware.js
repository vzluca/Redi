// ============================================================
// PROTECCIÓN DEL PANEL (Vercel Edge Middleware)
// Pide usuario + contraseña (HTTP Basic Auth) antes de mostrar
// NADA del panel. Aunque alguien encuentre el link, sin la clave
// no puede entrar.
//
// La clave NO está en el código: se lee de variables de entorno.
// En Vercel → Project → Settings → Environment Variables, creá:
//     PANEL_USER = luca           (el usuario que quieras)
//     PANEL_PASS = una-clave-larga-y-privada
// y volvé a deployar. Si no están seteadas, el panel queda
// bloqueado por seguridad (nadie entra).
// ============================================================
export const config = { matcher: '/:path*' };

export default function middleware(request) {
  const USER = process.env.PANEL_USER;
  const PASS = process.env.PANEL_PASS;
  const auth = request.headers.get('authorization') || '';

  if (USER && PASS && auth.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const sep = decoded.indexOf(':');
      const u = decoded.slice(0, sep);
      const p = decoded.slice(sep + 1);
      if (u === USER && p === PASS) return; // credenciales OK → deja pasar
    } catch (e) { /* header inválido → cae al 401 */ }
  }

  return new Response('Acceso restringido — Panel de Redi (RedLabs)', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Redi — RedLabs", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
