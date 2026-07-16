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
| **Descubrimiento**: pregunta antes de cotizar y recomienda lo mínimo que sirve | ✅ | `brain/redi-system-prompt.md` |
| Cotizar servicios/combos/web leyendo el Sheet en tiempo real | ✅ | tool `Consultar_Catalogo` |
| **Tiempo de entrega** estimado según proyectos en curso | ✅ | tools `Ver_Proyectos_En_Curso` + `Calcular_Entrega` |
| Pilotear el *"no me alcanza"* y recotizar de cero | ✅ | `brain/redi-system-prompt.md` |
| **Seña 50%** por transferencia (solo si rechaza la llamada) | ✅ | `config_operativa.sena` |
| Detectar **urgencia** → prioriza y adelanta la llamada | ✅ | tools `Guardar_Lead` + `Derivar_a_Humano` |
| **Memoria persistente** (recuerda y saluda "hola de nuevo") | ✅ | `Memoria persistente (Postgres)` |
| **Buffer de mensajes** (junta los cortos seguidos) | ✅ | nodos `Bufferizar` + `Esperar 8s` |
| **CRM completo** (qué quiere, presupuesto, pagos, saldo, entrega) | ✅ | tools `Cargar_CRM` + `Actualizar_Pago` |
| Responder FAQ desde **Base de Conocimiento** en el Sheet | ✅ | tool `Consultar_BaseConocimiento` |
| Captar y guardar leads | ✅ | tool `Guardar_Lead` |
| Agendar llamadas con Luca (Google Calendar) | ✅ | tool `Agendar_Llamada` |
| Pasar a humano cuando lo piden | ✅ | tool `Derivar_a_Humano` |
| **Informe diario solo si hubo movimiento** (si no, no gasta nada) | ✅ | `n8n/redi-informe-diario.json` |
| Seguimiento a leads fríos (**A/B testing**) + satisfacción | ✅ | `n8n/redi-seguimiento.json` |
| Reporte semanal con métricas + **posts de Meta** + consejos IA | ✅ | `n8n/redi-reporte-semanal.json` |
| Disciplina de costos (temp 0.3, tokens y memoria acotados) | ✅ | `n8n/redi-cerebro.json` |
| Panel web propio de Redi + **chat con Redi** | 🔜 Etapa 2 | `panel/` (próximo) |

---

## 🗂️ Estructura del repo

```
Redi/
├── README.md                     ← estás acá
├── brain/
│   ├── catalogo.json             ← espejo del Sheet (14 servicios + combos + web + personalizados)
│   └── redi-system-prompt.md     ← el "cerebro": personalidad + árbol de cotización
├── n8n/
│   ├── redi-cerebro.json         ← workflow principal: multicanal + memoria + buffer + AI Agent + tools + CRM
│   ├── redi-informe-diario.json  ← cron diario 20:00: resumen SOLO si hubo movimiento
│   ├── redi-seguimiento.json     ← cron diario: leads fríos (A/B) + satisfacción
│   └── redi-reporte-semanal.json ← cron viernes: reporte con métricas + posts de Meta
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
