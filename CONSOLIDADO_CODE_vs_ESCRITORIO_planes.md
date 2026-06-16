# Consolidado Code + Escritorio — Flujo de Planes/Paywall PWA (post-1.5)

Cruce de la validación de **Escritorio** (3 bugs A/B/C) con la de **Code** (lectura de la nativa + API PayPal Live). Marca dónde coincidimos y dónde no.

---

## ✅ EN LO QUE COINCIDIMOS

| Tema | Code | Escritorio |
|------|------|------------|
| Lo que **funciona** en 1.5: paywall fullscreen a nivel body, links Términos/Privacidad, botón "Continuar FREE", versión "Cobrex Web 1.5", logout→onboarding reaparece (en logout real), post-login→Mercados | ✅ | ✅ |
| **Síntoma BUG A**: los botones de trial/compra van **directo a PayPal**, no abren el paywall primero. Es **preexistente** (no se introdujo en 1.5, no estaba en el cuadro) | ✅ | ✅ |
| **BUG C**: `sessionStorage.cobrex_paywall_seen` persiste en la misma sesión de browser y bloquea que el paywall (C3) re-dispare. Hay que **limpiarlo en SIGNED_OUT** antes del reload | ✅ (lo incorporo) | ✅ (lo detectó él) |
| **BUG B** = arquitectural, no es un bug nuevo del fix: en logout real el onboarding reaparece; el problema es que C3/onboarding compiten con SIGNED_IN cuando la sesión persiste | ✅ | ✅ |

---

## ❌ EN LO QUE NO COINCIDIMOS

### 1. El FIX del BUG A (cómo cobra la nativa) — DIVERGENCIA PRINCIPAL

**Escritorio dice:** *"En la nativa esos botones abren el checkout propio de Aurex (Railway backend). Fix: cambiar `window.open(paypal...)` por una llamada al backend Aurex (igual que nativa)."*

**Code dice: eso es incorrecto.** La nativa **NO** tiene checkout en Railway. Cobra con **compra in-app de Apple/Google vía RevenueCat**. Evidencia en el código:
- `SubscriptionScreen.js:4` → `import Purchases from 'react-native-purchases'`
- `SubscriptionScreen.js:120` → `const { customerInfo } = await Purchases.purchasePackage(pkg);`
- `SubscriptionScreen.js:126-135` → chequea `customerInfo.entitlements.active['pro'|'elite']` y emite `plan_changed`
- El `BACKEND` de Railway (`:13`) se usa solo para **sincronizar** el plan (webhook/entitlement), nunca para cobrar.

**Consecuencia:** la web **no puede** hacer compra in-app de Apple/Google. PayPal es el **único** procesador viable (Stripe y Lemon Squeezy descartados para Argentina). No existe un "checkout Aurex" al que llamar. Por lo tanto el fix correcto del BUG A **no** es "llamar al backend Aurex", sino:
- (a) que el botón **abra el paywall primero** (como la nativa `navigate('Subscription')`), y
- (b) que dentro del paywall el pago vaya a **PayPal apuntando a los planes Cobrex** (no a los viejos).

### 2. El origen del "AUREX" — aporte de Code que Escritorio no detectó

Verificado por **API de PayPal Live** (16-jun): los botones de `index.html` (2969/2975/3037/3043 + 3794/3795/3824/3825) tienen hardcodeados los **plan_id viejos de AUREX**, que están **INACTIVE** y cuelgan de productos `aurex-pro`/`aurex-elite` ("AUREX PRO/ELITE"). Los productos nuevos **"Cobrex PRO"** (`PROD-6HK29222W24001317`) y **"Cobrex ELITE"** (`PROD-31296005PJ8395110`) ya existen, están **ACTIVE** y bien nombrados. El sistema dinámico (`index.html:4393`) reescribe los viejos por los Cobrex al cargar `/api/plans` — verificado en vivo que los botones quedan en Cobrex AR. El "AUREX" aparece cuando el fetch dinámico **no llega/ falla antes del clic** → cae al fallback viejo.
- **Fix:** reemplazar los plan_id hardcodeados viejos por los **Cobrex Global** como fallback → nunca más se expone AUREX, aunque falle la carga dinámica.
- **PayPal NO se toca:** el nombre del producto es inmutable por API, y no hace falta (ya hay productos Cobrex).

---

## Plan de reconstrucción propuesto por Code (rama `web-1.6`, NO se deploya sin OK)

1. **Paywall como pantalla de inicio tras login FREE** (full-screen con "Saltar ✕"), no `navTo('mercados')` + popup 1,5s. (`App.js:245-253`, `SubscriptionScreen.js:209-249`)
2. **Perfil → Planes con pestañas FREE/PRO/ELITE** (hoy ocultas), botón → abre el paywall. (`PerfilScreen.js:421/478/515`)
3. **Botón compra/trial abre el paywall**; dentro, PayPal apuntando a **Cobrex** (fallback Cobrex Global, no AUREX).
4. **BUG C**: `sessionStorage.removeItem('cobrex_paywall_seen')` en SIGNED_OUT (aporte de Escritorio).
5. Validar en vivo FREE/PRO/ELITE: orden del paywall, pestañas en Perfil, ningún botón a AUREX (capturas).

---

## ❓ Pregunta para Escritorio

Code sostiene, con el código a la vista, que la nativa cobra por **RevenueCat (compra in-app Apple/Google)** y que **no existe** un checkout en Railway. ¿Escritorio puede confirmar/refutar esto revisando `SubscriptionScreen.js` (líneas 4, 120, 126)? Es clave: define si el BUG A se arregla con PayPal (postura de Code) o con un "backend Aurex" (postura de Escritorio, que Code cree inexistente).
