# 🖥️ Panel de Redi

El panel de control de RedLabs: desde acá Luca ve y maneja todo lo que hace Redi —
resumen del negocio, bandeja unificada (WhatsApp/Instagram/Email), CRM con pagos,
leads, agenda, reporte semanal y un **chat directo con Redi**.

Estética alineada a redlabs.digital: fondo oscuro, acento rojo, tipografía sans limpia,
sin adornos. Tiene modo claro/oscuro (botón arriba a la derecha).

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
