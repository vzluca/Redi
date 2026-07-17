# 🔐 Seguridad de Redi

Estado honesto de la seguridad del proyecto. Lo dividimos en **lo que ya está resuelto** y
**lo que falta cerrar antes de conectar datos reales**. Leelo antes de poner Redi en producción.

---

## ✅ Ya resuelto

- **Sin secretos en el repositorio.** Los workflows de n8n usan placeholders (`PEGAR_...`),
  no hay ninguna API key, token ni contraseña real commiteada.
- **XSS en el panel corregido.** Todo el texto que viene de clientes (nombres, mensajes de
  WhatsApp/IG, consultas) se **escapa** antes de mostrarse (función `esc()` en `panel/index.html`).
  Un cliente no puede inyectar código mandando un mensaje con HTML/script.
- **`.gitignore`** para que nunca se suban `.env`, claves ni credenciales por accidente.
- **El cliente pone sus propias cuentas** (360dialog, Meta, Apify): las credenciales sensibles
  no pasan por vos más de lo necesario, y el cliente puede revocarlas cuando quiera.

## ⚠️ Falta cerrar antes de producción (importante)

### 1. Login en el panel — **crítico**
Hoy el panel **no tiene autenticación**: cualquiera con la URL vería los datos.
Ahora corre con datos demo, así que no hay fuga real, pero **antes de conectarlo a datos
reales hay que ponerle login.** Opciones (elegí una):
- **Firebase Auth** (encaja con tu stack) — login con tu Google, y las reglas de Firestore
  permiten leer solo a tu usuario.
- **Vercel Password Protection** (Pro) o **Cloudflare Access** — más simple, protege toda la URL.

### 2. Verificar los webhooks de n8n — **crítico**
Los webhooks de WhatsApp e Instagram hoy aceptan **cualquier POST**. Alguien que descubra la
URL podría mandar mensajes falsos y hacer que Redi responda/actúe (spam y gasto de tokens).
Cómo cerrarlo:
- **Instagram/Meta:** verificar la cabecera `X-Hub-Signature-256` con el *App Secret* (HMAC-SHA256
  del cuerpo). Agregá un nodo al inicio que valide la firma y corte si no coincide.
- **360dialog (WhatsApp):** configurá un **token/secreto** en la URL del webhook y validalo en un
  nodo `IF` al inicio; si no coincide, descartás el mensaje.
- **General:** activá en n8n la autenticación del webhook (header auth) donde el proveedor lo permita.

### 3. Credenciales en el almacén de n8n, no inline
En los nodos HTTP dejé las keys como texto de ejemplo para que se entienda dónde van. En
producción, **cargá las keys reales en n8n → Credentials** (no en el cuerpo del nodo) para que
no queden guardadas en el JSON del workflow si algún día lo exportás o compartís.

### 4. Permisos mínimos (menor privilegio)
- **Google OAuth:** pedí solo los scopes necesarios (Sheets/Calendar/Gmail del proyecto), no acceso total.
- **Postgres (memoria):** usá un usuario con acceso solo a la base de Redi, no un superusuario.
- **Firestore (cuando conectes el panel):** reglas que permitan leer/escribir solo a tu usuario.

### 5. Inyección de prompts (riesgo bajo-medio)
Redi lee mensajes de clientes y tiene herramientas. Un cliente podría intentar “convencerlo” de
hacer algo raro. El daño posible es acotado (las tools solo guardan un lead, crean un evento o te
avisan a vos — nada masivo ni destructivo). Buenas prácticas ya aplicadas / a mantener:
- No le des a Redi herramientas destructivas ni de envío masivo.
- No pongas secretos dentro del system prompt.
- El tope de iteraciones del agente (6) evita loops de herramientas.

---

## ✅ Checklist antes de ir a producción

- [ ] Panel con login (Firebase Auth / Vercel / Cloudflare Access).
- [ ] Webhooks de WhatsApp e Instagram con verificación de firma/token.
- [ ] Todas las API keys cargadas en n8n → Credentials (ninguna inline).
- [ ] OAuth de Google con scopes mínimos.
- [ ] Usuario de Postgres con permisos acotados a la base de Redi.
- [ ] Reglas de Firestore restringidas a tu usuario.
- [ ] HTTPS en todo (Firebase y Vercel ya lo dan por defecto).
- [ ] Repasar que ningún `.env` ni key real quede en el repo (`.gitignore` ya ayuda).

> Regla de oro: **nunca** commitees claves reales. Si una se filtró alguna vez, revocala y generá
> una nueva. Todas las cuentas (360dialog, Meta, Google, Apify) permiten revocar accesos.
