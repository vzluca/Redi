# Modelo de negocio: hosting, mantenimiento y costos de IA

Guía de referencia para Luca. Define dónde vive cada flujo, quién paga los tokens y cómo cotizar
para no perder plata con el volumen.

---

## 1. Las 3 modalidades de contratación

| Modalidad | Dónde vive el flujo | Quién pone la clave de OpenAI (tokens) | Vos ves el flujo | Si se rompe |
|---|---|---|---|---|
| **Alquiler** | Tu n8n | El cliente (o vos, cubierto en la cuota) | Sí | Lo arreglás vos (incluido) |
| **Venta pura** | n8n del cliente | El cliente | No (hasta que te llame) | Soporte por hora |
| **Venta + mantenimiento** | n8n del cliente | El cliente | **Sí (como colaborador)** | Incluido / con tope |

### ¿Cómo "veo" el flujo sin alojarlo? (colaborador)
En n8n el cliente te suma como **miembro/colaborador** de su cuenta. Vos entrás cuando querés,
monitoreás, actualizás y arreglás — sin pagar hosting ni tokens.
- Requiere que el cliente tenga un plan de n8n que permita varios usuarios (n8n Cloud **Pro**), o
  un n8n **self-hosted** donde tengas login.
- Por eso el mantenimiento **sí tiene valor** aunque el flujo sea del cliente: no es "hosting", es
  **que no se rompa + que mejore + prioridad**. Las APIs (WhatsApp, Meta, Google) cambian y alguien
  tiene que estar encima.

---

## 2. Tokens: la regla para nunca perder plata

**Regla de oro:** que **cada cliente ponga su propia clave de OpenAI**. Así los tokens no son tu costo,
ni siquiera en alquiler. Tu "n8n Pro gratis" úsalo para **Redi** (tu bot) y para pruebas.

**Si igual ponés vos la clave:**
- Usá **`gpt-4o-mini`** para los bots de clientes (~10x más barato que `gpt-4o`).
- Poné un **tope de gasto mensual** en la clave de OpenAI de cada cliente.

### Números aproximados (verificar en openai.com/api/pricing)
- `gpt-4o-mini`: ~USD 0,15 / millón de tokens de entrada · ~USD 0,60 / millón de salida.
- Costo estimado por mensaje del bot: **~USD 0,001 con mini** (~USD 0,01 con 4o).
- Ejemplo: bot con **500 mensajes/mes** → mini ≈ **USD 0,50** · 4o ≈ USD 5.

---

## 3. Cotizar según volumen (clave)

Un flujo puede ser **simple pero con mucho volumen**. Ahí el mantenimiento sube por la **cantidad
de mensajes**, no por la complejidad. Redi lo hace automático, pero la lógica es:

1. Preguntar al cliente: *"¿Cuántos mensajes/consultas por mes calculás?"*
2. `costo_ia_usd = mensajes_mes × usd_por_mensaje[modelo]`
3. Si supera lo incluido en la base (300 msj), sumar recargo:
   `recargo_mensual = costo_ia_usd × 2,5` (con eso la IA queda en ~40% → **margen ~60%**).
4. Cuota mensual final = **cuota base del servicio + recargo de volumen**.
5. Poner el **tope de OpenAI del cliente** en `costo_ia_usd × 1,3` (colchón). Si se dispara, corta.

**Ejemplo:** un bot FAQ simple (base u$s 35/mes) con **3.000 mensajes/mes** (mini):
`costo_ia = 3000 × 0,001 = u$s 3` → `recargo = 3 × 2,5 = u$s ~8` → **cuota ≈ u$s 43/mes**, con la
IA cubierta y tu margen intacto.

> Todo esto está parametrizado en `brain/catalogo.json` → `config_operativa.costos_ia`. Cambiá los
> números ahí y Redi los usa.

---

## 4. Páginas web: qué estás cobrando y qué es aparte

- **El precio del Sheet (u$s 200–550) paga el DESARROLLO:** tu trabajo diseñando y construyendo la
  página a medida (no plantilla), responsive, formulario, dominio configurado, SSL, SEO básico. Es
  tu tiempo y tu talento, no "hosting".
- **Hosting (Vercel/Firebase):** capa gratis, **USD 0** para sitios chicos. Que quede **en la cuenta
  del cliente** (titularidad y factura suyas). Vos no quedás atado.
- **Dominio .com:** aparte, ~USD 10–15/año, **lo paga el cliente** (a su nombre).
- **"Solo quiero el HTML":** cobrás igual el desarrollo. Pero "solo HTML" = **landing** (sin backend);
  un "sitio con base de datos" es más que HTML. Aclarale el alcance.
- **Cambios después de la fecha pactada → se cobran.** Poné siempre en el presupuesto:
  *"Incluye hasta X revisiones / hasta la fecha Y; después, cada cambio se cotiza aparte."*

---

## Resumen de bolsillo
- **Alquiler** → tuyo el hosting, kill switch, MRR.
- **Venta** → del cliente, soporte por hora.
- **Venta + mantenimiento** → del cliente + vos colaborador + cuota por cuidarlo.
- **Tokens** → siempre clave del cliente + `gpt-4o-mini` + tope mensual.
- **Volumen** → más mensajes = más cuota (Redi lo cotiza solo).
- **Web** → cobrás el desarrollo; hosting y dominio son del cliente; cambios extra se cobran.
