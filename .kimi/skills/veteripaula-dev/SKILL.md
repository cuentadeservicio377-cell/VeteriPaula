---
name: veteripaula-dev
description: "Skill personalizado para VeteriPaula. Combina project-flow + gbrain + develop-web-game + game-developer. Usar SIEMPRE que se trabaje en este proyecto."
---

# VeteriPaula Dev — Skill del Proyecto

## Trigger

Cualquier tarea en el repositorio `/Users/pablomeneses/Documents/Kimi Code/VeteriPaula/`

## Flujo de Inicio de Sesión

```
1. Leer .kimi/memory/MEMORY.md
2. Leer .kimi/memory/PLAN.md
3. Leer .kimi/memory/PROGRESS.md
4. Leer TODOS.md
5. Leer .kimi/AGENTS.md (reglas actuales)
6. (Opcional) Buscar en gbrain: search_pages query="veteripaula"
7. Resumir estado en máximo 5 líneas
```

## Flujo de Desarrollo (Iteración)

### Paso 1: Scope Check
- Verificar que la tarea está en PLAN.md o TODOS.md
- Si NO está → anotar en Parking Lot y preguntar al usuario

### Paso 2: Implementar Pequeño
- Un solo feature o fix por iteración
- Seguir convenciones de AGENTS.md

### Paso 3: Testing con Playwright
```bash
# Asegurar que el dev server corre
npm run dev &

# Ejecutar test de la mecánica correspondiente
node .claude/skills/develop-web-game/scripts/web_game_playwright_client.js \
  --url http://localhost:5173 \
  --actions-file tests/e2e/<mecanica>-<nivel>.json \
  --iterations 3 --pause-ms 250

# Revisar screenshots
open output/web-game/shot-*.png
```

### Paso 4: Verificar Estado
- `render_game_to_text()` debe reflejar el estado visible
- Sin errores de consola
- Sin regresiones en mecánicas anteriores

### Paso 5: Actualizar Documentación
- Agregar entry en `.kimi/memory/PROGRESS.md`
- Marcar tarea en `TODOS.md`
- Dejar TODOs para siguiente agente si aplica

## Patrones de Arquitectura (de game-developer)

### State Machine para Estados del Juego
```javascript
// src/game-engine/StateMachine.js
class State {
  enter() {}
  tick(dt) {}
  exit() {}
}

class GameStateMachine {
  constructor() {
    this.current = null;
    this.states = new Map();
  }
  register(name, state) { this.states.set(name, state); }
  transitionTo(name) {
    this.current?.exit();
    this.current = this.states.get(name);
    this.current?.enter();
  }
  tick(dt) { this.current?.tick(dt); }
}
```

### Object Pooling para Partículas
```javascript
// src/game-engine/ParticlePool.js
class ParticlePool {
  constructor(createFn, initialSize = 50) {
    this.pool = [];
    this.createFn = createFn;
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }
  get() {
    return this.pool.length > 0 ? this.pool.pop() : this.createFn();
  }
  release(obj) {
    this.pool.push(obj);
  }
}
```

### Component Caching en Game Loop
```javascript
// src/game-engine/GameLoop.js
class GameLoop {
  constructor(canvas) {
    // Cachear referencias UNA VEZ
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    // ... nunca buscar en DOM en update()
  }
}
```

## Hooks de Testing Requeridos

### window.render_game_to_text()
Debe retornar JSON con:
```json
{
  "mode": "playing|menu|celebration|paused",
  "level": 1,
  "biome": "casa|granja|bosque|selva",
  "score": 0,
  "stars": 0,
  "entities": [
    {"type": "paula", "x": 100, "y": 200, "state": "idle"},
    {"type": "animal", "x": 300, "y": 200, "state": "hurt"},
    {"type": "word", "x": 200, "y": 400, "text": "PERRO"}
  ],
  "timer": 45,
  "attempts": 0
}
```

### window.advanceTime(ms)
```javascript
window.advanceTime = (ms) => {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  for (let i = 0; i < steps; i++) gameLoop.update(1/60);
  gameLoop.render();
};
```

## Cierre de Sesión

```
1. ¿Código funciona? (Playwright pasó)
2. ¿Documentado? (PROGRESS.md, MEMORY.md)
3. ¿Commit? git commit -m "<tipo>: <descripción>"
4. ¿TODOS.md actualizado?
5. ¿gbrain sincronizado?
   python3 ~/.kimi/skills/gbrain-local/gbrain-wrapper.py put \
     "veteripaula/memory" < .kimi/memory/MEMORY.md
   python3 ~/.kimi/skills/gbrain-local/gbrain-wrapper.py put \
     "veteripaula/progress" < .kimi/memory/PROGRESS.md
```
