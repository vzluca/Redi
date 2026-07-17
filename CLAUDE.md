# CLAUDE.md — Notas del proyecto Redi (RedLabs)

Contexto para cualquier sesión que trabaje en este repo. Leé esto antes de construir o modificar flujos.

## Qué es esto
- **Redi** = el cerebro/asistente de IA de **RedLabs** (empresa de Luca). Atiende WhatsApp/Instagram/Email,
  cotiza los servicios de RedLabs leyendo el Google Sheet, agenda, hace CRM, seguimiento y reportes.
- RedLabs **vende automatizaciones (n8n), chatbots y páginas web** a otros negocios.
- El repo tiene: `brain/` (prompt + catálogo), `n8n/` (workflows), `panel/` (dashboard web),
  `docs/` (manual y guías).
- Fuente de verdad de precios/lógica: el **Google Sheet** de RedLabs; su espejo local es `brain/catalogo.json`.

## ⚙️ REGLA FIJA — Disciplina de costos al construir flujos de n8n PARA CLIENTES
Cuando Luca pida armar/modificar un flujo de n8n **para un cliente**, aplicá SIEMPRE por defecto,
sin que haga falta que lo pida:
1. **Modelo LLM barato:** usar **`gpt-4o-mini`** (no `gpt-4o`). El `gpt-4o` queda reservado para
   **Redi** (el bot de ventas de RedLabs), donde la calidad de venta importa.
2. **Temperatura baja:** 0.2–0.3.
3. **Límite de tokens de respuesta** (`maxTokens`) en el nodo del modelo (según la tarea, ~300–500).
4. **Tope de iteraciones del agente** (`maxIterations`, ~6) para que no entre en loops de herramientas.
5. **Memoria corta** (window ~12) salvo que la tarea necesite más.
6. **Cada cliente usa SU propia clave de OpenAI**, cargada como credencial por cliente, con un
   **tope de gasto mensual** en la cuenta de OpenAI del cliente (así el volumen no genera pérdida).
7. **Normalización/ruteo con código, no con IA** cuando se pueda (no gastar LLM en lo determinístico).

## 💵 REGLA FIJA — Cotización según volumen
Un flujo puede ser **simple pero con mucho volumen de mensajes**; ahí el mantenimiento sube por la
**cantidad**, no por la complejidad. Al cotizar un servicio con IA que lleva mensual:
- Estimar los **mensajes/mes** que va a recibir el cliente.
- Calcular el costo de IA en USD y sumar un **recargo de volumen** al mantenimiento, dejando
  **≥50–60% de margen** limpio (ver `config_operativa.costos_ia` en `brain/catalogo.json`).
- Poner un **tope mensual** en la clave de OpenAI del cliente para blindar el margen.
- Redi ya tiene esto en su prompt: le pregunta al cliente el volumen y ajusta la cuota.

## 🏠 Modelos de contratación (dónde vive el flujo)
- **Alquiler:** lo aloja RedLabs (n8n de Luca). Control total + kill switch. Incluye mantenimiento.
- **Venta:** el cliente lo aloja en SU n8n con SUS cuentas (incl. su OpenAI). Es suyo; soporte por hora.
- **Venta + mantenimiento:** el cliente lo aloja, pero **suma a Luca como colaborador** en su n8n
  (Luca lo ve y mantiene sin alojarlo). Cuota mensual por cuidarlo/mejorarlo.
- Detalle en `docs/modelo-negocio-hosting.md`.

## Convenciones de repo
- Rama de trabajo: `claude/redi-n8n-bot-0tcjsq`. PRs en draft; el usuario los mergea.
- Textos y UI en **español rioplatense**. El panel: estética RedLabs (rojo `#EE2B24`, negro `#050403`,
  warm white `#F7F5F2`, Instrument Sans + Tomorrow, plano, sin bordes innecesarios).
- No commitear claves reales: usar placeholders `PEGAR_...` (ver `SECURITY.md`).
