# AGENTS.md — VeteriPaula

> Reglas del flujo project-flow + gbrain + game-dev skills

---

## Stack (DEFINITIVO)
- **Framework UI**: React 18 + Vite
- **Renderizado juego**: HTML5 Canvas 2D API
- **Lenguaje**: JavaScript (ES2022)
- **Audio**: Web Audio API + Web Speech API (TTS)
- **Build**: Vite
- **Deploy**: GitHub Pages
- **Testing**: Playwright (skill develop-web-game)

---

## Reglas de Oro

### 1. SCOPE LOCK (Inquebrantable)
- Durante ejecución de CUALQUIER fase, si descubres un bug/mejora/refactor que NO está en el plan actual → NO lo toques
- Anótalo en `TODOS.md` bajo **Parking Lot**
- Continúa con la tarea actual
- ÚNICA excepción: Si el bug IMPIDE continuar, reporta y pide decisión

### 2. INTEGRACIÓN DE SKILLS

#### develop-web-game (Testing Loop)
En CADA iteración de código del game engine:
1. Implementar el cambio más pequeño posible
2. Agregar/actualizar `window.render_game_to_text()` si cambia el estado
3. Verificar que `window.advanceTime(ms)` existe
4. Correr Playwright client:
   ```bash
   node .claude/skills/develop-web-game/scripts/web_game_playwright_client.js \
     --url http://localhost:5173 \
     --actions-file tests/e2e/veteripaula-actions.json \
     --iterations 3 --pause-ms 250
   ```
5. Revisar screenshots en `output/web-game/`
6. Si hay errores, arreglar ANTES de continuar

#### game-developer (Arquitectura)
Aplicar estos patrones del skill:
- **State Machine** para estados del juego (menú → jugando → pausa → celebración)
- **Object Pooling** para partículas y efectos (evitar crear/destroy en loops)
- **Component Caching** en el game loop (no buscar en DOM cada frame)
- **Delta time** para animaciones frame-independent

### 3. MEMORIA PERSISTENTE
- Leer `.kimi/memory/MEMORY.md` al inicio de cada fase
- Leer `.kimi/memory/PLAN.md` antes de cada tarea
- Actualizar `.kimi/memory/PROGRESS.md` después de cada fase
- Actualizar `TODOS.md` en tiempo real

### 4. CHECKPOINTING
- Después de cada fase completada: `git commit` con mensaje descriptivo
- Guardar estado en `.kimi/memory/PROGRESS.md`
- Guardar en gbrain con `put_page` (slug: `veteripaula/memory`, `veteripaula/progress`)

### 5. CIERRE DE SESIÓN
Antes de terminar CUALQUIER sesión:
- [ ] ¿El código funciona? (tests/Playwright pasan)
- [ ] ¿Está documentado? (MEMORY.md, PROGRESS.md actualizados)
- [ ] ¿Hay commit? (`git log` muestra el último)
- [ ] ¿TODOS.md está actualizado?
- [ ] ¿gbrain tiene la última versión?

---

## Convenciones
- Niveles: `level<N>-<asset>.png` para screenshots
- Código: estructura por nivel en `src/game-engine/`
- Assets: organizados por bioma en `public/assets/`
- Tests E2E: `tests/e2e/<mecanica>-<nivel>.json` para actions

---

## Qué NO tocar sin consultar
- Screenshots existentes (evidencia de progreso)
- `docs/specs/` (documentación de diseño aprobada)
