# Cobrex Web 1.5 — Flujo de sesión + Paywall (PWA = Nativa 1.3.45)

Corrección sobre la 1.4 ya publicada → esta versión se etiqueta **"Cobrex Web 1.5"** (Soporte `index.html:2665` + header Perfil `index.html:4703`).

**Rama:** `web-1.5` · **Base:** `main` (= producción 1.4) · **NO deployado** (espera OK escrito de Fernando)
**Archivos tocados:** `app/index.html`, `app/aurex-i18n.js` (solo esos 2)
**Referencia nativa:** `~/AurexApp` → `App.js`, `screens/PerfilScreen.js`, `screens/SubscriptionScreen.js`, `lib/brand.js`

Origen: 2 bugs de flujo que reportó Fernando + el diff de paywall de Escritorio. Todos validados con captura real (Playwright Chrome, viewport 402×874), no chequeo de DOM.

---

## Cuadro de cambios

| # | Tema | Síntoma (antes) | PWA archivo:línea | Referencia nativa | Ajuste técnico | Validación |
|---|------|-----------------|-------------------|-------------------|----------------|------------|
| 1 | **Paywall invisible / manda a Perfil** | El paywall auto-abierto al loguear FREE (regla C3) no se veía; visualmente parecía que entraba a Perfil | `index.html:3061` (fn `abrirModalPlanes` @3058) | Paywall nativo es pantalla propia (`SubscriptionScreen.js`), no anidada | `#modal-planes` estaba dentro de `#screen-perfil` (oculto → `width/height = 0`). Ahora `abrirModalPlanes` lo mueve a `document.body` antes de mostrarlo: `if(m.parentElement!==document.body) document.body.appendChild(m);` — mismo patrón que `mis-alertas-modal` y `modal-aviso-legal` | Captura: modal a nivel BODY, `display:block`, fullscreen **402×874 top:0** |
| 2 | **Post-login va a Perfil** | Tras loguear quedaba en Perfil/cuenta | `index.html:1103` (handler `SIGNED_IN`) | Tab inicial nativa = **Mercados** | En el evento `SIGNED_IN`: `try { if (window.navTo) window.navTo('mercados'); } catch(e){}` | Captura: pantalla visible tras login = `mercados` |
| 3 | **Onboarding no reaparece al re-loguear** | Cerrar sesión y volver a entrar saltaba Splash + Onboarding | `index.html:1105-1115` (handler `SIGNED_OUT`) | Logout nativo: `await AsyncStorage.clear()` (`PerfilScreen.js:269`) → borra `aurex_onboarding_done`; al re-loguear `App.js:114` lo lee `null` → muestra `OnboardingScreen` | El logout PWA (`logoutUser`) **no recargaba** → la variable `_done` (cacheada en boot @`index.html:451`) seguía `true` y el onboarding quedaba oculto. Fix: en `SIGNED_OUT` → `['aurex_onboarding_done','onboardingDone','aurex_ob_done'].forEach(k=>localStorage.removeItem(k));` + `location.reload()` (re-monta desde cero, como la nativa) | Claves del gate = las mismas que el reset `?resetOnboarding=1` (@446) y `App.js:114/219` |
| 4 | **Paywall: faltan links legales** | Sin Términos / Privacidad arriba | `index.html:2796-2800` (tras subtítulo Pulse) | `SubscriptionScreen.js:229/333` (`t('terminos')`/`t('privacidad')`, color `#58A6FF`); URLs en `lib/brand.js:14-15` | Fila de 2 links azules `#58A6FF` subrayados con separador `·`: `onclick="window.open('https://cobrex.io/terms.html','_blank')"` y `…/privacy.html`. **URLs verificadas en vivo = 200** (las `/docs/` daban 404 → corregidas) | Captura: "Términos de uso · Política de privacidad" en azul bajo el subtítulo |
| 5 | **Paywall: falta botón continuar FREE** | No había salida "seguir gratis" | `index.html:2888-2894` (dentro de `plan-panel-FREE`) | Botón gris "Continuar con el plan FREE" del card FREE nativo | Botón `background:#E7E9ED;color:#3A3F47` ancho completo, `onclick="cerrarModalPlanes()"`, `data-i18n="pw_continuar_free"` | Captura: botón gris visible bajo "Ver plan PRO →" |
| 6 | **i18n de los textos nuevos** | — | `aurex-i18n.js:523-525` | — | 3 claves en los 8 idiomas: `pw_terminos`, `pw_privacidad`, `pw_continuar_free` | `node -c` OK |
| 7 | **Cache-bust** | Navegadores servían el i18n viejo | `index.html:594` | — | `aurex-i18n.js?v=14 → ?v=15` (hay claves nuevas sobre la 1.4) | — |
| 8 | **Versión** | Decía "Cobrex Web 1.4" | `index.html:2665` + `4703` | `PerfilScreen.js:957` | Etiqueta `Cobrex Web 1.4 → 1.5` en Soporte y header de Perfil | — |

---

## Elementos del paywall que YA estaban (no se tocaron) — confirmados en captura

- Estructura **fullscreen** (overlay opaco que cubre 402×874, no se filtra el Perfil de atrás).
- Subtítulo **"Todos los planes incluyen Cobrex Pulse"** (`planes_incluyen_pulse`).
- **3 tarjetas apiladas** FREE / PRO / ELITE (sin pestañas).
- Emojis **🚀 / 👑** en los botones de trial (PRO / ELITE).
- Nota del **trial** ("después $X/mes").

## NO es divergencia (verificado en código nativo)

- El gating de los 3 planes (FREE 5 portfolio / 1 watchlist / 5 toggles / paywall · PRO ∞/∞/14 · ELITE ∞/∞/15) ya estaba alineado a `usePlan.js` + backend `PLAN_LIMITS`.
- Los 26 ítems de la auditoría previa (`AUDITORIA_PWA_vs_NATIVA_1.3.45.md`) ya estaban resueltos y doble-validados. No se detectaron otras divergencias con la nativa más allá de estas 7 filas.

## Cómo revisar el diff exacto

Comparación de la rama vs producción (solo 2 archivos, `app/index.html` + `app/aurex-i18n.js`):
`https://github.com/fmoscon-creator/cobrex/compare/main...web-1.5`

---

**Pendiente:** OK escrito de Fernando → merge/push a `main` (deploy a cobrex.io/app). Reversión a la 1.4 actual: `git push origin main:main --force` desde el commit actual de main, o tag `safe-web-1.3-pre14`.
