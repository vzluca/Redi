# 🚀 Puesta en marcha de Redi

Guía paso a paso para dejar a Redi andando en n8n. No hace falta que sepas
programar: es cargar credenciales y pegar datos.

---

## 1. Preparar el Google Sheet (fuente de verdad)

Redi lee y escribe en un único Google Sheet. Partí del que ya tenés
(`Centro de INFO RedLabs`) y asegurate de que tenga estas hojas con estos encabezados
en la **fila 1**:

| Hoja | Columnas (fila 1) |
|---|---|
| `Catálogo Servicios` | (la que ya tenés — Redi la lee tal cual) |
| `Leads` | `fecha`, `nombre`, `contacto`, `canal`, `interes`, `resumen`, `score`, `estado`, `ultimo_seguimiento` |
| `Agenda` | `fecha_hora`, `nombre`, `contacto`, `tema`, `estado` |
| `Clientes Activos` | `nombre_empresa`, `contacto`, `servicios`, `modelo`, `precio_impl`, `cuota_mensual`, `fecha_inicio`, `estado`, `encuesta_mes` |

> Copiá el **ID del Sheet**: está en la URL, entre `/d/` y `/edit`.
> `https://docs.google.com/spreadsheets/d/`**`ESTE_ES_EL_ID`**`/edit`

## 2. Credenciales en n8n

En n8n → **Credentials**, creá:

- **OpenAI** — tu API key (o la cuenta Pro que compartís). La usan Whisper (audios), el AI Agent y el reporte.
- **Google Sheets / Calendar / Gmail** — con OAuth de la cuenta de RedLabs.
- **360dialog (WhatsApp)** — la API key va en los nodos HTTP (no necesita credencial de n8n).
- **Meta (Instagram)** — el Page Access Token va en el nodo HTTP de Instagram.

## 3. Importar los workflows

En n8n → **Workflows → Import from File**, importá:
1. `n8n/redi-cerebro.json`
2. `n8n/redi-seguimiento.json`
3. `n8n/redi-reporte-semanal.json`

## 4. Configurar el Cerebro (`redi-cerebro.json`)

1. **Nodo `Redi (AI Agent)` → System Message:** borrá el texto de ejemplo y pegá
   **todo** el contenido de `brain/redi-system-prompt.md`.
2. **Nodos de Google Sheets (tools):** en cada uno reemplazá `PEGAR_ID_DEL_SHEET`
   por el ID del paso 1 y elegí la credencial de Google.
3. **Nodo `GPT-4o` y `Transcribir Audio (Whisper)`:** elegí la credencial de OpenAI.
4. **Nodos de WhatsApp** (`Responder WhatsApp`, `Derivar_a_Humano`): reemplazá
   `PEGAR_API_KEY_360` por la API key de 360dialog y `NUMERO_DE_LUCA` por tu número
   (formato internacional sin `+`, ej. `5493511234567`).
5. **Nodo `Responder Instagram`:** reemplazá `PEGAR_PAGE_ACCESS_TOKEN` por el token de Meta.
6. **Nodo `Agendar_Llamada`:** elegí tu Google Calendar.

### Conectar los webhooks
- **WhatsApp:** copiá la URL del nodo `WhatsApp In (360dialog)` y configurala como
  webhook en el panel de 360dialog.
- **Instagram:** copiá la URL del nodo `Instagram In (Meta)` y cargala en tu app de
  Meta for Developers (producto *Instagram → Webhooks*).
- **Email:** el nodo `Email In (Gmail)` ya escucha solo con la credencial de Gmail.

## 5. Configurar los crons

- `redi-seguimiento.json`: reemplazá `PEGAR_ID_DEL_SHEET`, la API key de 360dialog y
  la credencial de Google. Corre todos los días 10:00.
- `redi-reporte-semanal.json`: ídem + `NUMERO_DE_LUCA`. Corre los viernes 18:00 y te
  manda el reporte por WhatsApp y email.

## 6. Activar y probar

- Activá los 3 workflows (toggle arriba a la derecha).
- Mandá un WhatsApp de prueba: *"Hola, ¿tienen un chatbot para WhatsApp?"* → Redi debería
  responder con el servicio, el precio con desglose, y ofrecer agendar.
- Mandá un audio para verificar la transcripción.
- Escribí *"quiero hablar con una persona"* → debería derivarte a vos.

---

## 🧩 Cómo cotiza Redi (referencia rápida)

- **Servicio del catálogo** → confirma servicio → precio base → suma funciones extra
  (addons) → desglose → alquiler vs. compra → agenda o guarda lead.
- **A medida** → releva 4 preguntas → clasifica Simple/Medio/Complejo → cotiza.
  **Complejo+ (más de 30 funciones) → deriva a Luca.**
- **Siempre** muestra el desglose. **Nunca** dice "nodos" (dice "funciones").

---

## 🔮 Próximos pasos (roadmap)

**Etapa 2 — Panel web de Redi** (`panel/`): una sola página donde Luca entra y ve
todo — inbox unificado (WPP/IG/email), leads y cotizaciones, agenda, clientes,
reporte semanal en vivo, y un botón para "tomar la conversación" (handoff manual).
Pensado para deployar en Firebase Hosting (tu stack).

**Otras ideas para sumarle a Redi:**
- 🧾 **Presupuestos en PDF** automáticos (S11) enviados por WhatsApp/email.
- 🌐 **Captación de leads desde tus redes** (comentarios/DMs que piden info → lead automático).
- 🔔 **Alertas para Luca** cuando entra un lead caliente o un cliente VIP escribe.
- 🗣️ **Redi con voz:** que responda audios con audios (TTS), no solo texto.
- 📈 **Métricas de publicaciones:** conectar Meta Insights para saber qué post trajo más contactos.
- 🧠 **Base de conocimiento (RAG):** que Redi responda FAQ desde tus propios documentos.
- 💳 **Link de pago** al cerrar (Mercado Pago) para cobrar la implementación al toque.
