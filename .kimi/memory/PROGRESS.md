# VeteriPaula — Progreso

## Sesión Actual: 2026-05-23

### Estado General
Nivel 1 en camino a "perfecto". Migración al flujo project-flow completada en sesión anterior.

### Hecho en esta sesión ✅
- [x] Creado `docs/specs/ASSET_DESIGN_GUIDE.md`
  - Especificaciones completas para diseñador/ilustrador futuro
  - Sprites, animaciones, paleta, backgrounds, familiares
  - Checklist de assets por nivel
  - Flujo de trabajo con diseñador
- [x] Pulido pixel art de Paula
  - Agregado estado `curing` (agachada aplicando venda)
  - Todos los estados necesarios para nivel 1: idle, walk, celebrate, pointing, worried, curing
- [x] Creado `src/audio/PhoneticEngine.js`
  - Síntesis de vocales /a/, /e/, /i/, /o/, /u/ usando formantes
  - Síntesis de consonantes: m, n, p, t, k, b, d, g, s, v, f, l, r
  - `spellPhonetic(word)` — deletrea palabra fonéticamente
  - `playNewSounds(sounds)` — reproduce sonidos nuevos del nivel
  - Integrado en TapWord: al acertar, deletrea la palabra
  - Integrado en GameScene: reproduce newSounds al inicio del nivel
- [x] Agregados hooks de testing
  - `window.render_game_to_text()` — estado completo del juego en JSON
  - `window.advanceTime(ms)` — avance determinístico de frames
  - Exponen scene y loop en `window.__gameScene` y `window.__gameLoop`
  - Limpieza al desmontar componente
- [x] Mejoras en GameScene
  - Paula cambia a `curing` brevemente antes de celebrar
  - Reproduce fonemas nuevos del nivel automáticamente
- [x] Build exitoso: 321KB JS, 1.48KB CSS
- [x] Commit: `49991a9`
- [x] Sincronizado con gbrain: `veteripaula/progress`, `veteripaula/design-guide`

### Estado del Nivel 1
| Sistema | Estado |
|---------|--------|
| Motor Canvas | ✅ Funcionando |
| Paula (6 estados) | ✅ Completo |
| Pipo (4 estados + interacciones) | ✅ Completo |
| TapWord mechanic | ✅ + fonética integrada |
| Anti-frustración | ✅ Progresivo, 4 etapas |
| Partículas | ✅ Confetti, corazones, estrellas |
| TTS | ✅ Instrucciones y celebraciones |
| SFX | ✅ Procedural completo |
| Fonética | ✅ /a/, /e/ del nivel 1 |
| Testing hooks | ✅ Playwright ready |
| Flujo completo | ✅ Home → Game → Celebration |

### Próxima Tarea
**Probar en iPad real** — El nivel 1 está listo funcionalmente. Falta:
1. Testing físico en iPad (touch, audio, TTS)
2. Ajustes de timing basados en playtesting con Paula
3. Cuando tengamos sprites del diseñador: reemplazar pixel art procedural

### Pendientes del Backlog
Ver `TODOS.md` para lista completa de v2.x
