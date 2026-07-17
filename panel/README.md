# 🖥️ Panel de Redi

El panel de control de RedLabs: desde acá Luca ve y maneja todo lo que hace Redi —
resumen del negocio, bandeja unificada (WhatsApp/Instagram/Email), CRM con pagos,
leads, agenda, reporte semanal y un **chat directo con Redi**.

Estética alineada al sistema de marca de RedLabs. Tiene modo claro/oscuro (botón arriba a la derecha).

## Marca (tokens)
- **Colores:** Primary Red `#EE2B24` (acento, con moderación), Primary Black `#050403`
  (ink/fondo), Warm White `#F7F5F2` (superficie). Definidos como variables CSS en `:root`.
- **Tipografías:** Instrument Sans (títulos + texto), Tomorrow (solo números/estadísticas),
  monoespaciada del sistema (labels, navegación, botones, metadata). Instrument Sans y Tomorrow
  se cargan de Google Fonts en producción; en el preview aislado caen a la fuente del sistema.
- **Estilo:** todo plano (sin degradados), sin bordes innecesarios (se separa por superficie y
  sombra), esquinas angulares y botones con la esquina cortada de la marca.
- **Logo:** el panel carga **`panel/logo.png`** como imagen (en el sidebar y en el avatar de
  Redi). **Poné tu logo oficial ahí**: subí el archivo a `panel/logo.png` y listo, aparece
  solo. Si el archivo no existe todavía, se muestra un trazo de respaldo en rojo (no queda roto).
  Podés usar la versión warm white o black exportándola con ese nombre según el fondo.

## Acceso / contraseña (protección)
El panel muestra una **pantalla de login propia** (usuario + contraseña, con la estética de
RedLabs) antes de dejar ver nada, vía `middleware.js` (Vercel Edge). Al ingresar bien, se guarda
una sesión por cookie (7 días); hay logout en `/__logout`. Aunque alguien encuentre el link, sin
la clave no entra. La clave **no está en el código**: se lee de variables de entorno.

**En Vercel (menú nuevo):** Settings → **Environments** → clic en **Production** → sección
**Environment Variables** → **Create**:

| Variable | Valor |
|---|---|
| `PANEL_USER` | el usuario que quieras (ej. `luca`) |
| `PANEL_PASS` | una contraseña larga y privada |

Después **Deployments → último → ⋯ → Redeploy**. Si esas variables no están seteadas, el panel
queda **bloqueado** por seguridad. Además, `robots.txt` y el header `noindex` evitan que aparezca
en Google.

> Nota: esta protección corre en **Vercel**. En **Firebase Hosting** no hay middleware; ahí la
> alternativa es una pantalla de login con **Firebase Auth**.

## Es un solo archivo

Todo el panel es `index.html` (HTML + CSS + JS en un archivo, sin dependencias externas).
Se puede abrir directo en el navegador o subir tal cual a cualquier hosting.

## Datos demo

Arranca con **datos de ejemplo** para que lo veas funcionando. La capa de datos está en
`index.html`, en el objeto **`REDI_API`** (buscá el comentario `REDI · PANEL — capa de datos`).
Para conectarlo a la operación real, reemplazá cada método por una llamada a tus webhooks de
n8n o a Firestore. Cada método ya documenta qué forma de datos devuelve.

Ejemplo:
```js
const BASE = 'https://TU-N8N/webhook';
const REDI_API = {
  async crm(){ const r = await fetch(`${BASE}/redi-crm`); return r.json(); },
  async leads(){ const r = await fetch(`${BASE}/redi-leads`); return r.json(); },
  async preguntarARedi(texto){
    const r = await fetch(`${BASE}/redi-chat`, {method:'POST', body: JSON.stringify({texto})});
    return (await r.json()).respuesta;
  }
  // ...
};
```

## Deploy en Firebase Hosting

```bash
cd panel
npm i -g firebase-tools     # si no lo tenés
firebase login
firebase init hosting        # elegí tu proyecto; public = "." ; SPA = sí
firebase deploy
```
El `firebase.json` ya está listo (sirve `index.html` y redirige todo a la SPA).

## Deploy en Vercel

```bash
cd panel
npm i -g vercel              # si no lo tenés
vercel                       # seguí los pasos; framework = "Other"
vercel --prod
```
El `vercel.json` ya está configurado.

## Próximo paso (para dejarlo 100% en vivo)
1. Publicar los webhooks de lectura en n8n (`redi-crm`, `redi-leads`, `redi-agenda`,
   `redi-reporte`, `redi-conversaciones`, `redi-chat`).
2. Enganchar esos endpoints en `REDI_API`.
3. Sumar login (Firebase Auth) para que solo entres vos.
