# COMPARATIVA v3 — Nativa 1.3.45 vs PWA (Code + Escritorio, con i18n)
**15-jun-2026.** Consolida: v2 (Issue #7) + auditoría i18n de Code + Escritorio (Issue #8).

## A) DEFECTOS FUNCIONALES/VISUALES (de la v2 — 12 ítems)
🔴 CRÍTICOS (7):
1. Campana de notificaciones del header AUSENTE en las 6 tabs. Nativa: BellButton.js + MercadosScreen.js:882. PWA: index.html:1807-1810 (sin campana).
2. Abre en PORTFOLIO; debería MERCADOS. Nativa: TabNavigator.js:90 (initialRouteName='Mercados'). PWA: index.html ~4078 navTo('portfolio').
3. Sin paywall al abrir para FREE. Nativa: App.js:251. PWA: no existe.
4. BUG plan ELITE→FREE. loadUserPlan no se llama en onAuthStateChange (index.html:1089-1099); solo poll en DOMContentLoaded (4528-4534) que se rinde. fmoscon=ELITE en backend.
5. Onboarding viejo (slides obs1-obs4, index.html:1190-1420) vs Build 36 nuevo.
6. Campana por activo AUSENTE en filas de Portfolio (openCreateAlert existe pero no expuesta).
7. Campana por activo AUSENTE en filas de Watchlist (idem).
🟠 ALTOS (2):
8. Mercados: falta tab METALES + orden distinto + Stable/ETF fusionados. Nativa MercadosScreen.js:171-179 (8 tabs); PWA index.html:1838-1846 (7 tabs, sw()).
9. Versión 'Cobrex v1.0' hardcodeada. index.html:2835.
🟡 MEDIOS (3):
10. Labels filtros IA: 'alta'→'Conf.IA', 'commodity'→'Mat.Primas' (cosmético).
11. Footer íconos: PWA SVG monocromo vs nativa duotono multicolor por tab (TabNavigator.js:17-18). PWA index.html:3999-4019.
12. BUG visual doble-$$ en Watchlist: aurex-features.js:2247 muestra '$'+precioFmt donde precioFmt=_fmt(precio) (2187) que ya trae '$'. → root cause CONFIRMADO.
✅ OK (5): precios dinámicos, motor IA/Pulse (10 vars + 14 fuentes), orden de tabs, marca Cobrex, tema dark/light.

## B) AUDITORÍA i18n (8 idiomas) — NUEVA, consolidada Code + Escritorio (Issue #8)
**B1. Completitud de los 8 idiomas:** ✅ COMPLETA en AMBOS. Ningún clave con idioma faltante/vacío (Code: 864 claves nativa / 673 PWA, 0 faltantes; Escritorio: 100% en ambos). Lo único 'igual en todos los idiomas' son nombres propios/producto (SOON, Face ID) — aceptable.
**B2. Textos que la PWA NO tiene (agregados/ajustados en iOS posteriores):**
   - Code (por valor exacto): 407 textos ES de la nativa no aparecen en la PWA. Por conteo de claves: 191.
   - Escritorio: ~70-120 genuinamente faltantes (atribuye gran parte de la diferencia a nomenclatura: nativa usa claves cortas, PWA prefijos port_/mkt_/wl_; + pantallas que no existen en PWA: MisAlertasScreen, onboarding nuevo). Las claves al_ca_* (modal alertas) coinciden exacto.
   - RECONCILIADO: faltante REAL de contenido ≈ 100-200 strings (la diferencia Code/Escritorio es por método: valor-exacto sobrecuenta paráfrasis; conteo-de-claves subcuenta por prefijos). Ambos coinciden: la PWA le falta una porción grande del texto traducido posterior. 🟠 ALTO.
**B3. Textos HARDCODEADOS en español en la PWA (sin pasar por i18n) — se ven en ES en cualquier idioma:** ≥5 confirmados:
   - 🔴 CRÍTICO: labels del gauge Cobrex Pulse — aurex-v3.js:3031-3035 ('Miedo Extremo','Miedo','Neutral','Codicia','Codicia Extrema'). Hardcodeados ES, visibles a todos los idiomas.
   - Onboarding viejo (textos ES en obs1-obs4).
   - Versión 'Cobrex v1.0' (index.html:2835).
   - Textos de eventos macro (vienen del backend en ES).
   - (Code ya había detectado/tradujo ~45 literales sueltos en una pasada previa; quedan estos confirmados por Escritorio.)

## C) META — IMPORTANTE
Ni Code ni Escritorio detectamos el gap i18n por nuestra cuenta: surgió porque Fernando apuntó a mirarlo. Conclusión: las comparaciones previas fueron de SUPERFICIE (pantallas/features visibles), NO totales. → Próximo paso acordado: INVENTARIO EXHAUSTIVO + diff sistemático de TODO (cada función, bloque de pantalla, estructura de datos: filtros, tipos de alerta, límites de plan, claves i18n, constantes, componentes, helpers) de ambos códigos, sin muestrear → v4 → a Escritorio.

NO se aplicó ningún fix. Solo evaluación.
