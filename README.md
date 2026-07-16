# 🤖 Redi — El cerebro de RedLabs

> **Redi** es el asistente de IA de RedLabs. Atiende WhatsApp, Instagram y email
> (texto **y** audio), cotiza los servicios leyendo tus precios en tiempo real,
> agenda llamadas con Luca, hace seguimiento a los clientes y te manda un reporte
> semanal. Es tu mano derecha. Y la izquierda.

**Nombre:** Redi — *Red*(Labs) + *ready* + onda asistente. Se queda. 💪
**Tagline:** *"Tu mano derecha. Y la izquierda."*
**Sus dos manos:**
- ✋ **Redi Ventas** — detecta consultas, cotiza desde el Sheet, capta y califica leads, deriva a humano.
- 🤚 **Redi Ops** — agenda llamadas, hace seguimiento, mide satisfacción y arma el reporte semanal.

---

## 🎯 Qué hace Redi (esta primera entrega: el bot n8n)

| Capacidad | Estado | Dónde vive |
|---|---|---|
| Responder WhatsApp (texto + audio) | ✅ | `n8n/redi-cerebro.json` |
| Responder Instagram DMs | ✅ | `n8n/redi-cerebro.json` |
| Responder emails (Gmail) | ✅ | `n8n/redi-cerebro.json` |
| Cotizar servicios/combos/web leyendo el Sheet en tiempo real | ✅ | `brain/` + tool `Consultar_Catalogo` |
| Captar y guardar leads | ✅ | tool `Guardar_Lead` |
| Agendar llamadas con Luca (Google Calendar) | ✅ | tool `Agendar_Llamada` |
| Registrar clientes cerrados en Sheets | ✅ | tool `Registrar_Cliente` |
| Pasar a humano cuando lo piden | ✅ | tool `Derivar_a_Humano` |
| Seguimiento a leads fríos + encuesta de satisfacción | ✅ | `n8n/redi-seguimiento.json` |
| Reporte semanal con métricas + consejos IA | ✅ | `n8n/redi-reporte-semanal.json` |
| Panel web propio de Redi | 🔜 Etapa 2 | `panel/` (próximo) |

---

## 🗂️ Estructura del repo

```
Redi/
├── README.md                     ← estás acá
├── brain/
│   ├── catalogo.json             ← espejo del Sheet (14 servicios + combos + web + personalizados)
│   └── redi-system-prompt.md     ← el "cerebro": personalidad + árbol de cotización
├── n8n/
│   ├── redi-cerebro.json         ← workflow principal: multicanal + AI Agent + tools
│   ├── redi-seguimiento.json     ← cron diario: leads fríos + satisfacción
│   └── redi-reporte-semanal.json ← cron viernes: reporte para Luca
└── docs/
    └── SETUP.md                  ← puesta en marcha paso a paso
```

## ⚙️ Cómo arranca (resumen)

1. Importás los 3 archivos de `n8n/` en tu cuenta de n8n.
2. Conectás credenciales: OpenAI, Google (Sheets/Calendar/Gmail), 360dialog (WhatsApp) y Meta (Instagram).
3. Pegás el System Prompt (`brain/redi-system-prompt.md`) en el nodo **Redi (AI Agent)**.
4. Reemplazás los `PEGAR_...` (ID del Sheet, API keys, número de Luca).
5. Activás los workflows.

👉 Guía detallada en **[docs/SETUP.md](docs/SETUP.md)**.

## 🧠 Regla clave

Redi **nunca inventa precios**: los lee del Google Sheet con la tool `Consultar_Catalogo`.
Si cambiás un precio en el Sheet, Redi lo refleja al toque. El Sheet es la **fuente de verdad**.

## 💡 Ideas para las próximas etapas
Ver **[docs/SETUP.md](docs/SETUP.md)** (sección "Próximos pasos") y el roadmap del panel web.
