# Comparación Técnica: Motores de Juegos Web para Veterin Paula

> **Fecha:** 2026-05-19  
> **Autor:** Arquitectura Técnica  
> **Contexto:** Juego educativo 2D para niños de 6 años. Stack actual: React 19 + Vite + Canvas 2D vanilla.

---

## Resumen Ejecutivo

| Opción | Bundle | Safari iPad | Curva | Animaciones | Recomendación |
|--------|--------|-------------|-------|-------------|---------------|
| **Canvas 2D + React (actual)** | ~0 KB overhead | ⭐⭐⭐ Excelente | ⭐⭐⭐ Baja | ⚠️ Manual | **MANTENER como core** |
| **Phaser 3** | ~500 KB | ⭐⭐⭐ Bueno (Canvas fallback) | ⭐⭐ Media | ⭐⭐⭐ Excelente | No justificado |
| **PixiJS v8** | ~200 KB + deps | ⭐⭐ Bueno | ⭐⭐ Media-Alta | ⭐⭐⭐ Render, no tweens | No justificado |
| **Godot Web Export** | ~9 MB gzipped | ⭐ Problemático | ⭐⭐⭐ Alta | ⭐⭐⭐ En motor, pesado en web | ❌ Descartar |
| **Three.js** | ~600 KB+ | ⭐⭐ Variable | ⭐⭐ Media-Alta | ⭐⭐ Hack para 2D | ❌ Overkill |
| **Rive** | ~200 KB runtime + 5-30 KB/.riv | ⭐⭐⭐ Bueno (Apple-native renderer) | ⭐⭐⭐ Baja-Media | ⭐⭐⭐⭐⭐ Excepcional | **ADOPTAR para personajes** |

---

## 1. Canvas 2D Vanilla + React (Stack Actual)

### Ventajas
- **Cero overhead de bundle**: Solo React + código propio. El build actual es extremadamente ligero.
- **Control total**: Cada frame, cada touch event, cada optimización está bajo control directo.
- **Integración perfecta con React**: `GameCanvas.jsx` como wrapper, estados compartidos fácilmente, hooks (`useTTS`, `useAudio`).
- **Safari iPad nativo**: Canvas 2D es una API nativa del browser, optimizada por Apple. Sin capas de abstracción.
- **Testing trivial**: Playwright accede al DOM y al canvas sin problemas.
- **Deploy simple**: GitHub Pages puro, sin headers CORS especiales ni service workers.

### Desventajas
- **Todo se implementa a mano**: tweening, sprite sheet parsing, atlas de texturas, sistema de partículas avanzado, gestión de audio compleja.
- **Riesgo de reinventar la rueda**: A medida que escalan a 50+ niveles con 24 animales, el código de animación puede volverse verboso.
- **No hay editor visual**: Las posiciones de elementos, timings de animación, y transiciones se ajustan código + refresh.

### Curva de aprendizaje
**Baja**. El equipo ya lo domina. Entender `requestAnimationFrame`, `ctx.drawImage()`, y el modelo de eventos táctiles es conocimiento estándar web.

### Rendimiento en Safari iPad
**Excelente**. Canvas 2D en iPadOS usa el backend de Core Graphics/Metal de Apple. Para el tipo de juego (<50 entidades, fondos simples, partículas básicas) mantiene 60fps sin esfuerzo. No hay overhead de WebGL context creation ni shader compilation.

### Capacidad de animaciones ricas
**Moderada-Alta (con esfuerzo)**. El proyecto ya tiene:
- Game loop con delta time
- Sistema de partículas (corazones)
- Entidades con estados (Paula idle/walk, animal hurt/happy)
- Transiciones manuales

Lo que les falta para "animaciones ricas":
- Tweening easing (linear, ease-out-bounce, ease-in-out)
- Sprite sheets con frames animados
- Skeletal animation (huesos para Paula)
- Efectos visuales avanzados (glow, blur, shake)

### Tamaño de bundle
**Mínimo**. Solo dependencias de React (~40 KB gzipped para React 19) + código propio. Probablemente <200 KB total gzipped sin assets.

### Testing/QA automatizado
**Muy fácil**. Playwright puede:
- Hacer click/touch en coordenadas del canvas
- Verificar estado del juego via callbacks (`onComplete`, `onFail`)
- Testear TTS via mocking de `speechSynthesis`
- Screenshots del canvas para regresión visual

### Comunidad y ejemplos
No aplica como "motor", pero React + Canvas es el estándar de la web. Documentación de MDN es autoritativa. Infinidad de tutoriales de Canvas 2D.

---

## 2. Phaser 3

### Ventajas
- **Batteries included**: Physics (Arcade + Matter.js), audio, input (touch/mouse/keyboard), scenes, asset loading (30+ formatos), tweens, particle emitters, 30+ Game Objects.
- **WebGL + Canvas dual renderer**: Auto-detecta WebGL y cae a Canvas si es necesario. En iPad se puede forzar Canvas para máxima compatibilidad.
- **Comunidad masiva**: 37.8k GitHub stars, miles de ejemplos, Phaser Editor (visual), templates.
- **Phaser 4 en camino**: Rewrite en TypeScript, WebGPU focus, bundle más pequeño.
- **Tweening nativo**: `this.tweens.add()` con easing curves built-in. Perfecto para animaciones de UI y personajes.
- **Particle emitters**: Sistema de partículas profesional con configuradores.

### Desventajas
- **Bundle ~500 KB**: Para un juego educativo simple, es un costo significativo.
- **Arquitectura opinionada**: Phaser quiere controlar el game loop, el canvas, y el input. Integrarlo con React requiere trabajo (montar Phaser en un `useEffect`, sincronizar estados React ↔ Phaser scenes).
- **State manager complejo**: El sistema de escenas de Phaser tiene curva de aprendizaje.
- **No React-native**: Pierden los beneficios del ecosistema React (hooks, context, componentes UI con CSS) a menos que hagan un híbrido complejo.

### Curva de aprendizaje
**Media**. No es complejo, pero hay que aprender: Scene lifecycle, Game Objects, Texture Manager, Camera, Tween Manager, Input Manager. 1-2 semanas para ser productivo.

### Rendimiento en Safari iPad
**Bueno**. Phaser permite forzar `renderer: Phaser.CANVAS` en la configuración, evitando problemas de WebGL en Safari. Esto hace que el rendimiento sea comparable al Canvas vanilla actual. Sin embargo, Phaser añade capas de abstracción que consumen algo de CPU.

Dato clave de la investigación: *"Switching from WebGL to Canvas rendering boosted performance by 30% on older devices"* — Phaser official blog, 2025.

### Capacidad de animaciones ricas
**Excelente**. Built-in:
- Sprite animation (frame-based)
- Tweening (position, scale, rotation, alpha, con easing)
- Particle emitters (fire, confetti, magic)
- Tile sprites
- Containers anidados

### Tamaño de bundle
~500 KB gzipped (Phaser 3 completo). Phaser 4 promete reducir esto, pero aún está en RC.

### Testing/QA automatizado
**Moderado**. Playwright puede interactuar con el canvas, pero Phaser maneja input internamente. Requiere:
- Dispatch de eventos táctiles en coordenadas específicas
- Esperar a que Phaser cargue assets (preload)
- Menos transparente que el stack actual

### Comunidad y ejemplos
**Excelente**. La mayor comunidad de frameworks HTML5. Miles de ejemplos oficiales, foros activos, plugins (phaser-matter-collision, navmesh, UI frameworks).

---

## 3. PixiJS v8

### Ventajas
- **Renderizado excepcional**: WebGL/WebGPU backend, batching optimizado. Bunnymark: 100k sprites a 60fps.
- **Bundle pequeño**: ~200 KB gzipped con tree shaking.
- **Package unificado**: `import { Sprite, Container } from 'pixi.js'` — no más sub-packages.
- **WebGPU ready**: Futuro-proof aunque WebGPU aún no esté en Safari iPad.
- **Muy rápido en estático**: Si hay muchos sprites que no se mueven, el renderer es casi gratuito.

### Desventajas
- **NO es un game engine**: Es un renderer 2D. No tiene:
  - Physics
  - Audio management
  - Scene management
  - Input handling (touch/click hay que hacerlo manual)
  - Tweening (necesitan GSAP, ~25 KB, o implementar propio)
  - Asset loading avanzado
  - Particle system (hay plugins como `@pixi/particle-emitter`)
- **Reescritura significativa**: Tendrían que reescribir todo el sistema de escenas, input, y lógica de juego para usar la API de Pixi (Containers, DisplayObjects).
- **Problemas históricos en iOS**: Issues reportados en iOS 15 donde Safari se congelaba con PixiJS graphics y masks. V8 mejora esto pero el riesgo existe.

### Curva de aprendizaje
**Media-Alta**. Hay que entender el sistema de DisplayObjects, Containers, Renderers, Textures, y luego integrar otras librerías para física, audio, tweens.

### Rendimiento en Safari iPad
**Bueno, con reservas**. WebGL en iPad puede tener problemas de context loss y memoria. PixiJS v8 soporta Canvas fallback pero pierde el beneficio principal. Para un juego con <50 sprites, la ventaja de rendimiento sobre Canvas 2D es **imperceptible**.

### Capacidad de animaciones ricas
**Renderizado excelente, animación limitada**. PixiJS dibuja sprites rápido, pero no anima. Necesitan:
- GSAP o Popmotion para tweens
- `@pixi/particle-emitter` para partículas
- Spine o DragonBones para skeletal animation (aumenta bundle)

### Tamaño de bundle
~200 KB base + GSAP (~25 KB) + particle-emitter (~20 KB) + loaders. Total: ~300-350 KB.

### Testing/QA automatizado
**Similar a vanilla**. Al ser un renderer sobre canvas, Playwright interactúa de forma similar. Pero hay que manejar la carga de assets de Pixi (texture loading es async).

### Comunidad y ejemplos
**Grande pero sesgada**. Mucha comunidad en visualizaciones de datos, dashboards, y experiencias interactivas. Menos ejemplos de "juegos educativos completos" que Phaser.

---

## 4. Godot Engine (Export Web/HTML5)

### Ventajas
- **Motor completo**: Editor visual, 2D renderer dedicado, sistema de animaciones, audio, scripting (GDScript).
- **Gratis y open source**: MIT license.
- **GDScript amigable**: Similar a Python, fácil para principiantes.
- **Export multiplataforma nativo**: Si algún día quieren app nativa iOS/Android, el mismo proyecto funciona.

### Desventajas
- **Bundle masivo**: ~9 MB gzipped, ~24 MB sin comprimir para un proyecto vacío. Esto es inaceptable para:
  - Niños de 6 años esperando en un iPad
  - Conexiones móviles lentas
  - GitHub Pages (límite de repo: no aplica, pero UX sí)
- **Safari/iPad problemático**: Documentación oficial de Godot dice:
  > *"Safari has several issues with WebGL 2.0 support that other browsers don't have"*
- **No C# en web**: GDScript obligatorio para export web.
- **WebGL 2.0 only**: No WebGPU. No Forward+/Mobile renderer.
- **Threads complicados**: SharedArrayBuffer requiere headers COOP/COEP (Cross-Origin-Opener-Policy, Cross-Origin-Embedder-Policy). Sin threads: audio jaggy, menos performance. Godot 4.3+ tiene single-threaded como default, pero con menos performance.
- **Integración con React/TTS imposible**: El juego corre en un canvas Wasm aislado. Acceder a `window.speechSynthesis` desde GDScript requiere hacks de JavaScript interop.
- **Testing con Playwright imposible**: No hay DOM accesible, es un canvas binario.

### Curva de aprendizaje
**Alta**. Nuevo editor, nuevo lenguaje (GDScript), nuevo workflow de export, debugging en browser complicado (consola Wasm).

### Rendimiento en Safari iPad
**Problemático**. WebGL 2.0 en Safari tiene bugs documentados. Godot web en iPad es conocido por:
- Tiempos de carga largos
- Audio con latencia
- Crashes por memoria (Wasm heap limitado)

### Capacidad de animaciones ricas
**Excelente en el motor, pobre en web**. Las animaciones 2D de Godot (skeletal, frame-based, blend trees) son potentes. Pero el peso del runtime destruye la UX en web.

### Tamaño de bundle
~9 MB gzipped mínimo. Con assets de 24 animales, música, sfx: fácilmente 15-20 MB+.

### Testing/QA automatizado
**Muy difícil**. No hay acceso al DOM. Requeriría:
- Testing visual con pixel comparison
- O integrar un framework de testing dentro de Godot (GUT)
- Nada de Playwright E2E

### Comunidad y ejemplos
**Creciente, pero web es segunda clase**. La comunidad Godot es enorme, pero el export web/HTML5 siempre ha sido el "pain point". La mayoría de ejemplos y tutorials son para desktop/mobile nativo.

---

## 5. Three.js

### Ventajas
- WebGL maduro, comunidad gigante, muchos ejemplos.
- Puede hacer 2D (usando planos ortográficos, sprites).

### Desventajas
- **Es un motor 3D**: Usarlo para 2D es un anti-pattern. Tendrían que:
  - Configurar cámara ortográfica
  - Mapear coordenadas 2D a 3D
  - Gestionar texturas como planes
  - Shader overhead para sprites simples
- **Bundle grande**: ~600 KB+ gzipped.
- **WebGL context overhead**: Crear un contexto WebGL para dibujar emojis y rectángulos redondeados es excesivo.
- **No tiene**: Sprite animation, tweening, input, audio, particle systems (a menos que usen addons).

### Veredicto
**Overkill confirmado**. Para un juego 2D educativo con emojis, rectángulos redondeados y texto, Three.js es como usar un martillo neumático para clavar un chinche.

---

## 6. Rive

### Ventajas
- **Animaciones interactivas con State Machines**: Paula puede tener estados (idle, walk, interact, celebrate) con transiciones definidas visualmente. Tocar un botón dispara una transición de estado sin código de animación.
- **Archivos diminutos**: 5-30 KB por archivo .riv (vectorial, binario). El de Paula probablemente <30 KB.
- **Runtime ligero**: ~200 KB gzipped (WASM + JS). Carga una vez, se comparte entre todas las animaciones.
- **Renderizado GPU-accelerado**: WebGL2 con fallback a Canvas2D. Tiene un renderer específico optimizado para Apple (Metal backend en iOS/macOS).
- **Integración React nativa**: `@rive-app/react-canvas` como componente. Se monta en un canvas separado o overlay.
- **60fps garantizado en mobile**: Diseñado específicamente para UI animations y characters en mobile.
- **Runtime editing**: Cambiar colores, textos, propiedades dinámicamente desde JS.

### Desventajas
- **NO es un motor de juegos**: No maneja game loop, scenes, input, physics. Es solo animación.
- **Requiere editor de Rive**: Diseñadores deben aprender Rive (editor web, similar a After Effects pero con state machines).
- **Costo**: Rive es gratis para individuos/open source. Equipos pequeños: plan gratuito probablemente suficiente.
- **Para partículas seguirían necesitando Canvas 2D**: Rive no reemplaza el sistema de partículas de corazones/estrellas.

### Curva de aprendizaje
- **Runtime (dev)**: Baja. `import Rive from '@rive-app/react-canvas'` + `<Rive src="paula.riv" stateMachine="PaulaStates" />`.
- **Editor (design)**: Media. El concepto de State Machines es diferente a After Effects/Lottie. 1-2 semanas para dominar.

### Rendimiento en Safari iPad
**Excelente**. Rive tiene:
- Renderer específico para Apple runtime (desde v6.0.0)
- WebGL2 con MSAA fallback
- Commits específicos: *"Bump rive-cpp to help fix safari and performance issues"*
- Menor uso de memoria GPU que Lottie (~2.6 MB vs ~149-190 MB)

### Capacidad de animaciones ricas
**Excepcional para personajes y UI**:
- **Skeletal animation**: Paula con huesos, joints, IK.
- **State Machines**: `idle` → `walk` → `interact` → `celebrate`. Transiciones con condiciones.
- **Interactive animations**: El animal responde al hover/touch con micro-animaciones.
- **Blend shapes**: Transiciones suaves entre estados.

### Tamaño de bundle
- Runtime: ~200 KB gzipped (one-time cost)
- Paula.riv: ~15-30 KB
- Animal_dog.riv: ~10-20 KB (comparten rig, diferentes skins)
- Total animaciones: ~150-300 KB para todos los personajes

### Testing/QA automatizado
**Fácil**. El componente React de Rive expone:
- `onStateChange`
- `onLoad`
- `rive.play()` / `rive.pause()`
- Playwright puede verificar que el canvas de Rive se monta y que los eventos de estado se disparan.

### Comunidad y ejemplos
**Creciendo rápido**. Rive es el estándar emergente para animaciones interactivas web/mobile. Documentación sólida, ejemplos de game UI, character animation. Comunidad activa en Discord.

---

## Análisis Comparativo por Dimensión Clave

### Dimensión: Safari iPad (Prioridad Alta)

| Opción | Score | Notas |
|--------|-------|-------|
| Canvas 2D + React | ⭐⭐⭐⭐⭐ | API nativa, 0 problemas conocidos |
| Phaser 3 | ⭐⭐⭐⭐ | Canvas fallback disponible, WebGL puede tener issues |
| PixiJS v8 | ⭐⭐⭐ | Problemas históricos iOS 15, WebGL context loss |
| Godot Web | ⭐⭐ | Documentado como problemático en Safari |
| Three.js | ⭐⭐⭐ | WebGL puede fallar en iPad |
| Rive | ⭐⭐⭐⭐⭐ | Renderer específico para Apple, WebGL2+Canvas fallback |

### Dimensión: Bundle Size (Prioridad Alta — niños, iPad, WiFi móvil)

| Opción | Size | Impacto UX |
|--------|------|------------|
| Canvas 2D + React | ~150 KB gzipped | ⚡ Instantáneo |
| Rive (añadido) | +200 KB runtime + 150 KB .rivs | ⚡ Rápido |
| Phaser 3 | ~500 KB | 🐢 Notable en 3G |
| PixiJS v8 + deps | ~350 KB | 🐢 Moderado |
| Three.js | ~600 KB+ | 🐢 Lento |
| Godot Web | ~9,000 KB+ | 🚫 Inaceptable |

### Dimensión: Facilidad de Desarrollo

| Opción | Score | Notas |
|--------|-------|-------|
| Canvas 2D + React | ⭐⭐⭐⭐⭐ | Ya lo tienen, familiar |
| Rive | ⭐⭐⭐⭐ | React component simple, editor visual |
| Phaser 3 | ⭐⭐⭐ | Mucha API que aprender, integración React compleja |
| PixiJS v8 | ⭐⭐⭐ | Hay que armar motor alrededor |
| Three.js | ⭐⭐ | Overkill, complejo para 2D |
| Godot | ⭐⭐ | Nuevo editor, nuevo lenguaje, nuevo workflow |

### Dimensión: Capacidad de Animaciones Ricas

| Opción | Score | Notas |
|--------|-------|-------|
| Rive | ⭐⭐⭐⭐⭐ | State machines, skeletal, interactive |
| Phaser 3 | ⭐⭐⭐⭐ | Tweens, particles, sprites nativo |
| Godot | ⭐⭐⭐⭐⭐ | En motor completo, pesado en web |
| PixiJS v8 | ⭐⭐⭐ | Excelente render, sin animación nativa |
| Canvas 2D + React | ⭐⭐⭐ | Posible, manual |
| Three.js | ⭐⭐ | No diseñado para 2D |

---

## Recomendación Estratégica

### Arquitectura Híbrida Recomendada

```
┌─────────────────────────────────────────────────────────────┐
│                    React 19 + Vite App                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌───────────────┐  │
│  │  Home   │  │  Map    │  │ Loading │  │ Celebration   │  │
│  │ Screen  │  │ Screen  │  │ Screen  │  │ Screen        │  │
│  └─────────┘  └─────────┘  └─────────┘  └───────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              GameCanvas (React component)              │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │              Canvas 2D Render Loop               │  │  │
│  │  │  • Background (gradients, clouds, flowers)      │  │  │
│  │  │  • Particles (hearts, stars, confetti)          │  │  │
│  │  │  • UI (buttons, text, level indicator)          │  │  │
│  │  │  • Reading Mechanics (ChooseWord, etc.)         │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Rive Canvas Overlay (separate <canvas>)       │  │  │
│  │  │  • Paula (idle/walk/interact/celebrate)        │  │  │
│  │  │  • Animal (hurt/healing/happy)                  │  │  │
│  │  │  • Interactive reactions                        │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  Audio: Web Audio API + Web Speech API (TTS) — nativo       │
└─────────────────────────────────────────────────────────────┘
```

### Decisiones Específicas

| Componente | Tecnología | Justificación |
|------------|-----------|---------------|
| **Game loop, fondos, UI, mecánicas** | **Canvas 2D vanilla** | Ya funciona, 0 overhead, perfecto para Safari iPad |
| **Paula (personaje)** | **Rive** | State machine: idle→walk→celebrate. Animación skeletal fluida. Archivo ~20 KB. |
| **Animales (24 tipos)** | **Rive con skins** | Un rig base, diferentes skins/textures. Cada animal ~10-15 KB. |
| **Celebraciones (familiares)** | **Rive** | Avatares animados con state machines. |
| **Partículas (corazones, estrellas)** | **Canvas 2D** | Ya implementado, funciona perfecto. Para confetti avanzado considerar `canvas-confetti` (~5 KB). |
| **Tweens (UI, transiciones)** | **Popmotion** (~10 KB) o **framer-motion** | Popmotion es puro JS, tiny, API declarativa. Framer-motion si ya lo conocen del ecosistema React. |
| **Audio/TTS** | **Web Audio API + SpeechSynthesis** | Nativo, funciona, no cambiar. |

### ¿Por qué NO cambiar el motor principal?

1. **Ya funciona**: Tienen un game loop estable, entities funcionando, mecánicas implementadas.
2. **Costo de migración > beneficio**: Reescribir todo en Phaser o PixiJS tomaría semanas y el resultado visual sería idéntico para un niño de 6 años.
3. **Safari iPad es sagrado**: Canvas 2D nunca falla. WebGL puede fallar.
4. **Bundle size importa**: Para niños con iPads en WiFi doméstico, cada KB cuenta.
5. **Testing**: Playwright con Canvas vanilla es más fácil que con cualquier motor Wasm/WebGL.

### ¿Por qué SÍ adoptar Rive?

1. **Diferenciador visual**: Las animaciones de Rive (skeletal, state machines) se ven "premium" comparadas con sprites estáticos o emojis.
2. **State Machines = match perfecto**: El flujo del juego es puramente state-based (discovering → treating → healing → celebrating). Rive modela esto nativamente.
3. **Tamaño ridículo**: 20 KB por personaje animado vs. 100+ KB de sprite sheets PNG.
4. **Editor no-code**: Un diseñador (o el desarrollador) puede crear animaciones sin tocar código.
5. **React integration**: `<RiveComponent stateMachine="Paula" onStateChange={...} />` es trivial.

### Flujo de Implementación Sugerido

```
FASE ACTUAL ──→ FASE 1: Refactor ──→ FASE 2: Rive ──→ FASE 3: Polish
     │                │                  │                │
     ▼                ▼                  ▼                ▼
Canvas 2D      Separar renderer     Crear Paula.riv   Tweens UI
+ Emojis       de entities          Crear 3 animales  Audio polish
               (preparar para       State machines    Rive reactions
               Rive overlay)        en GameScene      en minijuegos
```

### Riesgos y Mitigaciones

| Riesgo | Mitigación |
|--------|-----------|
| Rive runtime no carga en Safari iPad antiguo | Fallback: mostrar sprite estático PNG. Rive tiene Canvas2D fallback. |
| Editor de Rive tiene curva de aprendizaje | Empezar con animaciones simples (3 estados: idle, walk, celebrate). No usar IK complejo inicialmente. |
| Dos canvas superpuestos (Canvas 2D + Rive) | Rive se monta como componente React posicionado `absolute` sobre el Canvas 2D. Sync de coordenadas vía props. |
| Bundle se infla con Rive | 200 KB one-time. Menos que un solo sprite sheet PNG de alta res. |

---

## Conclusión

> **Para Veterin Paula, el stack actual (Canvas 2D vanilla + React) es el motor correcto.** No hay razón técnica para migrar a Phaser, PixiJS, Godot o Three.js. El costo de migración supera ampliamente cualquier beneficio para un juego 2D educativo simple.
>
> **La recomendación es evolucionar, no reemplazar:** Mantener Canvas 2D como motor de juego y **adoptar Rive como capa de animación de personajes**. Esto da el mayor "bang for the buck" visual sin comprometer rendimiento, bundle size, ni compatibilidad con Safari iPad.
>
> **Metric target**: Bundle total <500 KB gzipped (código + runtime Rive + assets .riv). Tiempo de carga <2s en WiFi doméstico. 60fps en iPad Air.
