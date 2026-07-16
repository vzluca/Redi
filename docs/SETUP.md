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
| `Base Conocimiento` | `pregunta`, `respuesta`, `categoria` |
| `Leads` | `fecha`, `nombre`, `contacto`, `canal`, `interes`, `resumen`, `score`, `prioridad`, `estado`, `ultimo_seguimiento`, `variante` |
| `Agenda` | `fecha_hora`, `nombre`, `contacto`, `tema`, `estado` |
| `CRM Clientes` | `fecha_alta`, `nombre`, `contacto`, `canal`, `que_quiere`, `servicios`, `presupuesto_total`, `detalle_presupuesto`, `modelo`, `pago_estado`, `monto_pagado`, `fecha_pago`, `saldo_pendiente`, `fecha_entrega_estimada`, `estado_proyecto`, `notas`, `encuesta_mes` |

> **`CRM Clientes`** es tu base de datos de control total (lo que pediste). Redi la carga y la
> actualiza sola: quién es, cómo contactarlo, qué quiere, el presupuesto pasado y qué incluye, si
> pagó, cuánto, qué día, **cuánto falta pagar**, la entrega estimada y el estado del proyecto. Es
> una hoja de Google (o sea, tipo Excel, exportable). En la Etapa 2 esto también se ve en el panel (Firebase).
> - `pago_estado`: **No pagó** · **Seña (50%)** · **Pagado total**
> - `estado_proyecto`: **Presupuestado** · **Señado** · **Esperando material** · **En curso** · **Entregado** · **Cerrado** · **Perdido**
> - Redi cuenta los que están **`En curso`** para estimar el tiempo de entrega.
>
> **`Base Conocimiento`**: Redi responde las preguntas frecuentes leyendo esta hoja. Cargás una
> fila (pregunta/respuesta) y ya la usa, sin tocar código.

> Copiá el **ID del Sheet**: está en la URL, entre `/d/` y `/edit`.
> `https://docs.google.com/spreadsheets/d/`**`ESTE_ES_EL_ID`**`/edit`

## 2. Credenciales en n8n

En n8n → **Credentials**, creá:

- **OpenAI** — tu API key (o la cuenta Pro que compartís). La usan Whisper (audios), el AI Agent y el reporte.
- **Google Sheets / Calendar / Gmail** — con OAuth de la cuenta de RedLabs.
- **360dialog (WhatsApp)** — la API key va en los nodos HTTP (no necesita credencial de n8n).
- **Meta (Instagram)** — el Page Access Token va en el nodo HTTP de Instagram.
- **Postgres** — para la **memoria persistente** de Redi (que recuerde conversaciones
  anteriores). Si no tenés una base, creá una gratis en **Supabase** o **Neon** (2 min, sin
  tarjeta) y cargá los datos de conexión en la credencial Postgres de n8n. El nodo
  `Memoria persistente (Postgres)` crea solo su tabla (`redi_memoria`).
  *(Alternativa sin base: cambiar ese nodo por "Simple Memory", pero se pierde la memoria si n8n
  se reinicia y no recuerda entre conversaciones — no recomendado.)*

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

- `redi-informe-diario.json`: reemplazá `PEGAR_ID_DEL_SHEET`, la API key de 360dialog y
  `NUMERO_DE_LUCA`. Corre todos los días 20:00 y te manda el resumen del día
  **SOLO si hubo movimiento** (leads, ventas, pagos o llamadas). Si el día estuvo tranquilo,
  **no manda nada y no gasta tokens** (corta antes de llamar a la IA).
- `redi-seguimiento.json`: reemplazá `PEGAR_ID_DEL_SHEET`, la API key de 360dialog y
  la credencial de Google. Corre todos los días 10:00. Hace **A/B testing**: alterna 2
  versiones del mensaje de reactivación y guarda la `variante` (A/B) para medir cuál cierra más.
- `redi-reporte-semanal.json`: ídem + `NUMERO_DE_LUCA`. Corre los viernes 18:00 y te
  manda el reporte por WhatsApp y email, incluyendo **qué publicación rindió más** (Meta).
  Para eso, en el nodo `Traer Insights (Meta)` reemplazá `PEGAR_INSTAGRAM_BUSINESS_ID` y
  `PEGAR_PAGE_ACCESS_TOKEN`. Si no lo configurás, el reporte igual sale (sin la parte de posts).

### Memoria y buffer (ya vienen en el Cerebro)
- **Memoria persistente:** Redi recuerda conversaciones anteriores por contacto. Si un cliente
  vuelve a escribir a la semana, lo saluda con *"¡Hola de nuevo!"* y retoma sin re-presentarse.
- **Buffer de mensajes:** si el cliente manda varios mensajes cortos seguidos, Redi espera ~8
  segundos y los junta como uno solo antes de responder (podés cambiar el tiempo en el nodo
  `Esperar 8s`).

## 6. Cotización: datos que tenés que setear vos

Estos van en `brain/catalogo.json` → `config_operativa` (y algunos en el Sheet):

- **Seña 50% por transferencia:** en `sena.datos_transferencia` poné tu **alias/CVU o link**
  de transferencia. Redi lo pasa **solo** al final, si el cliente rechaza la llamada. (No usa
  Mercado Pago.)
- **Tiempos de entrega:** en `tiempos_entrega` están los `dias_base` por servicio y la
  **fórmula**. El modelo actual: con 2 proyectos en simultáneo, cada uno tarda el doble
  (ej: 5 días solo → 10 con otro en curso); capacidad 2 en paralelo; el que sobra espera en
  cola; +2 días de holgura. **Revisá esos números conmigo** y ajustalos a tu ritmo real.

## 7. Activar y probar

- Activá los 3 workflows (toggle arriba a la derecha).
- Mandá un WhatsApp: *"Hola, quiero mejorar mi negocio pero no sé bien qué necesito"* → Redi
  debería **hacerte preguntas** antes de cotizar, recomendar lo justo, dar precio con desglose
  **y tiempo de entrega**, ofrecer llamada, y recién si decís que no, pasar la seña.
- Probá *"uh, no me alcanza, mostrame algo más barato"* → debería recotizar sin insistir.
- Mandá un audio para verificar la transcripción.
- Escribí *"lo necesito urgente"* → debería priorizarte y adelantar la llamada.
- Escribí *"quiero hablar con una persona"* → debería derivarte a vos.

---

## 🧩 Cómo trabaja Redi ahora (flujo comercial)

**Presentación → Descubrimiento (preguntas) → Definir lo que necesita de verdad →
Presupuesto con desglose + tiempo de entrega → Ofrecer llamada con Luca →
(si dice que no) Seña 50% por transferencia → Cierre.**

- Recomienda **lo mínimo que sirve**, nunca cobra de más.
- Sabe pilotear el *"no me alcanza"* y **recotizar de cero**.
- Detecta **urgencia** → marca prioritario, adelanta la llamada y te avisa.
- **A medida:** Simple/Medio/Complejo se cotizan; **Complejo+ (>30 funciones) → deriva a Luca.**
- **Siempre** muestra el desglose. **Nunca** dice "nodos" (dice "funciones").

## 💸 Disciplina de costos (ya viene configurada)

- Modelo conversacional **GPT-4o** con `temperature 0.3` y **máx 500 tokens** por respuesta.
- **Memoria corta** (últimos 12 mensajes) y **tope de 6 iteraciones** del agente (no se cuelga
  llamando tools de más).
- El **reporte** usa **gpt-4o-mini** (más barato) porque no necesita el modelo grande.
- La transcripción (Whisper) y la normalización de mensajes **no gastan tokens de más**.
- La normalización de cada canal es código puro, sin IA.

---

## 🔮 Próximos pasos (roadmap)

**Etapa 2 — Panel web de Redi** (`panel/`): una sola página donde Luca entra y ve todo —
inbox unificado (WPP/IG/email), leads y cotizaciones, agenda, clientes, reporte en vivo, y un
botón para "tomar la conversación" (handoff manual). **Incluye un chat con Redi** donde Luca le
habla directo y le pregunta qué está pasando / qué está haciendo (en vez de por WhatsApp).
Pensado para Firebase Hosting.

**Ya incorporado en esta versión:** descubrimiento con preguntas, recomendación del mínimo
necesario, tiempo de entrega, seña 50% por transferencia, urgencia/prioridad, base de
conocimiento en el Sheet, A/B testing en seguimiento y métricas de Meta en el reporte.

**Ideas que quedan para más adelante:**
- 🧾 **Presupuesto en PDF** con tu marca, enviado por WhatsApp/email al cerrar.
- 🗣️ **Redi con voz:** que responda audios con audios (TTS).
- 🌐 **Captación automática desde redes:** comentarios/DMs que piden info → lead solo.
