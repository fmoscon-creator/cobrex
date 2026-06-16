# Cobrex Web 1.6 — Reconstrucción del flujo de Planes/Paywall

Rama `web-1.6` (NO deployada, main = producción 1.5). Solo 2 archivos: `app/index.html`, `app/aurex-i18n.js`.
Base: consenso Code + Escritorio (la nativa cobra por RevenueCat IAP; la web usa PayPal apuntando a Cobrex).
Todo validado en local con Playwright Chrome + login real FREE (aurextester12). Capturas en el mensaje a Fernando.

| # | Tema | Antes (1.5) | Ahora (1.6) | Referencia nativa |
|---|------|-------------|-------------|-------------------|
| 1 | **Orden del paywall tras login** | `navTo('mercados')` + popup a 1,5s | Handler `SIGNED_IN` carga el plan y, si es FREE, abre el paywall en **modo 'login'** (apilado + **"Saltar ✕"**) ANTES de Mercados; al cerrar/saltar → `navTo('mercados')` | `App.js:245-253` (onReady→navigate Subscription fromLogin) · `SubscriptionScreen.js:209` (Saltar ✕) |
| 2 | **Perfil → Planes** | Modal con 3 tarjetas apiladas, pestañas ocultas | Botón "Ver planes" abre el modal en **modo 'perfil'** = **pestañas FREE/PRO/ELITE** (una por vez). El botón de cada plan **abre el paywall apilado primero**, no salta a PayPal | `PerfilScreen.js:414-425` (tabs) · `:478/:515` (botón → navigate Subscription) |
| 3 | **Compra / trial → "AUREX"** | Botones con plan_id viejos de **AUREX (INACTIVE)**, salto directo a PayPal | `cbxBuy(planId)` mode-aware: en 'perfil' revela el paywall; en apilado va a PayPal con plan **Cobrex** (Global, ACTIVE). El sistema dinámico reescribe a la variante **AR** por región | Web usa PayPal (la nativa = IAP RevenueCat, imposible en web). Productos PayPal ya son "Cobrex PRO/ELITE" |
| 4 | **BUG C (Escritorio)** | `cobrex_paywall_seen` quedaba en sessionStorage → el paywall no re-disparaba al re-loguear | `SIGNED_OUT` hace `sessionStorage.removeItem('cobrex_paywall_seen')` antes del reload | — |
| 5 | **i18n + versión** | — | Clave `pw_saltar` (8 idiomas). Etiqueta "Cobrex Web 1.5"→**"1.6"** (Soporte + header Perfil). Cache-bust `aurex-i18n.js?v=16` | `t('saltar')` |

## Arquitectura del modal (web-1.6)
`abrirModalPlanes(mode)` con 3 modos = las 2 superficies nativas:
- **'login'** → apilado FREE/PRO/ELITE + "Saltar ✕" (post-login). Al cerrar → Mercados.
- **'stacked'** → apilado normal (upsell banner / límite de plan).
- **'perfil'** → pestañas (sección Planes de Perfil). El CTA de un plan → pasa a 'stacked' (revela paywall) = nativa `navigate('Subscription')`.

`cbxBuy(planId)`: en 'perfil' revela el paywall apilado; en apilado abre PayPal (`subscribe?plan_id=...` Cobrex). El plan_id queda literal en el onclick → el sistema dinámico (`/api/plans`) lo reescribe a la variante regional (AR/Global).

## Verificación API PayPal (16-jun) — los plan_id de los botones
- `P-4JH161461V818874SNIW7UAA` → **Cobrex PRO Mensual** · ACTIVE
- `P-2N0098015C849324MNIW7UAI` → **Cobrex PRO Anual** · ACTIVE
- `P-0AN884893H6644053NIW7UAQ` → **Cobrex ELITE Mensual** · ACTIVE
- `P-11266502KC039145PNIW7UAQ` → **Cobrex ELITE Anual** · ACTIVE
(En AR el sistema dinámico los lleva a las variantes "Cobrex … AR", también ACTIVE.) Cero AUREX.

## Validación local (Playwright Chrome, viewport 402×874, login real FREE)
- Login FREE → `plan=FREE`, `mode='login'`, paywall **visible** con "Saltar ✕", Mercados detrás → Saltar → paywall cierra, queda Mercados. ✓
- Perfil → "Ver planes" → modo 'perfil': pestañas visibles, 1 panel por vez (FREE/PRO/ELITE). ✓
- Perfil tab PRO → clic comprar → revela paywall apilado (NO abre PayPal todavía). ✓
- Paywall apilado → clic comprar → PayPal con plan_id **Cobrex** (AR). ✓
- Logout → `aurex_onboarding_done`=null, `cobrex_paywall_seen`=null, onboarding visible. ✓
- 0 errores de código (los 404 de service-worker/logo y 422 de Supabase son artefactos locales).

## Diff
`https://github.com/fmoscon-creator/cobrex/compare/main...web-1.6`

Pendiente: revisión de Escritorio + OK escrito de Fernando → merge a main (deploy). Reversión a 1.5: `git push origin main:main` desde 22cd2d6 / tag `safe-web-1.3-pre14`.
