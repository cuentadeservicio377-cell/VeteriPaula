# Veterin Paula — Especificación de Diseño

> **Fecha:** 2026-05-19  
> **Estado:** APPROVED  
> **Modo:** Builder (proyecto personal/educativo)  

---

## Propósito

Juego educativo web para niños de ~6 años que aprenden a leer. La protagonista, Paula, recorre su camino para convertirse en veterinaria, encontrando animales heridos en situaciones cotidianas y curándolos mediante desafíos de lectura progresivos.

---

## Qué Hace Este Juego Especial

- **Lectura como gameplay**: Cada acción de curar requiere leer. No hay lectura pasiva — Paula SIEMPRE está leyendo para avanzar.
- **Progresión pedagógica real**: 50+ niveles que van de "elegir palabra" a "seguir instrucciones de 3 pasos".
- **Conexión emocional**: Mensajes de celebración de familiares reales (Mamá, Papá, Abuelo, Abuela, Bubu, Bibi).
- **Minijuegos de vocabulario**: Pantallas de carga que enseñan palabras nuevas en lugar de mostrar una barra de progreso vacía.
- **Sonido + imagen**: TTS lee las palabras en voz alta. Ilustraciones tipo cuento infantil.

---

## Audiencia

- **Primaria**: Paula, 6 años, lee palabras simples, está aprendiendo oraciones.
- **Secundaria**: Padres/madres que quieren una herramienta open source para ayudar a sus hijos a leer.

---

## Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Framework UI | React 18 (Vite) |
| Renderizado juego | HTML5 Canvas 2D API |
| Lenguaje | JavaScript (ES2022) |
| Estilos | CSS Modules / styled-components |
| Audio | Web Audio API + Web Speech API (TTS) |
| Testing | Playwright |
| Build | Vite |
| Deploy | GitHub Pages (estático) |

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        React App                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌───────────────┐  │
│  │  Home   │  │  Map    │  │ Loading │  │ Celebration   │  │
│  │ Screen  │  │ Screen  │  │ Screen  │  │ Screen        │  │
│  └─────────┘  └─────────┘  └─────────┘  └───────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              GameCanvas (React component)              │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │              Canvas 2D Render Loop               │  │  │
│  │  │  • Level Scene (background, entities)           │  │  │
│  │  │  • Animal Entity (herido → sano animation)      │  │  │
│  │  │  • Paula Entity (walk, interact)                │  │  │
│  │  │  • Reading Mechanic (current phase)             │  │  │
│  │  │  • Particle Effects (hearts, stars)             │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Estructura de Niveles (50+)

### Bioma 1: Casa y Barrio (Niveles 1–12)
**Mecánica**: Elegir palabra correcta entre 2-3 opciones  
**Animales**: Perro, gato, conejo, hamster, pájaro doméstico, tortuga  
**Vocabulario**: casa, calle, jardín, pata, cola, oreja, ojo, herida, venda, medicina, agua, comida  
**Ejemplo de nivel**:
> "El perrito tiene la pata lastimada. ¿Qué necesita?"
> Opciones: [VENDA] [HUESO] [AGUA] → Toca VENDA

### Bioma 2: Granja (Niveles 13–25)
**Mecánica**: Formar palabras con sílabas sueltas  
**Animales**: Vaca, gallina, caballo, cerdo, oveja, pato, burro  
**Vocabulario**: granja, establo, corral, leche, huevo, lana, cascos, plumas, alimento, cepillo  
**Ejemplo de nivel**:
> "La vaca tiene hambre. Forma la palabra:"
> Sílabas: [AL] [LI] [MEN] [TO] → Arrastra para formar ALIMENTO

### Bioma 3: Bosque (Niveles 26–38)
**Mecánica**: Seguir instrucciones de 2-3 pasos en orden  
**Animales**: Zorro, ciervo, ardilla, erizo, búho, conejo silvestre  
**Vocabulario**: bosque, árbol, madriguera, nido, fruta, nuez, río, otoño, invierno  
**Ejemplo de nivel**:
> "El zorro tiene una espina en la pata. Sigue los pasos:"
> 1. Lava la herida → 2. Saca la espina → 3. Pon venda
> Paula toca cada paso en orden correcto.

### Bioma 4: Selva y Exóticos (Niveles 39–50+)
**Mecánica**: Combinación de todas las mecánicas + oraciones completas  
**Animales**: Mono, tucán, jaguar, tortuga marina, delfín (zoológico), loro  
**Vocabulario**: selva, río, fruta tropical, plátano, mango, coco, hoja grande, liana, cueva  
**Ejemplo de nivel**:
> "El mono se cayó de la liana. Lee la receta del doctor:"
> "Primero pon hielo en la cabeza. Después dale un plátano. Al final dale un abrazo."
> Paula realiza cada acción leyendo y tocando.

---

## Sistema de Celebraciones

Cada 2 niveles, al curar el animal, aparece un mensaje de un familiar:

| Familiar | Niveles | Estilo |
|----------|---------|--------|
| Mamá | 1, 13, 26, 39 | Cariñoso, orgulloso |
| Papá | 3, 15, 28, 42 | Animado, divertido |
| Abuelo | 5, 17, 30, 44 | Sabio, tranquilo |
| Abuela | 7, 19, 32, 46 | Dulce, emotivo |
| Bubu (tío con barba) | 9, 21, 34, 48 | Energético, chistoso |
| Bibi (tío sin barba) | 11, 23, 36, 50 | Creativo, curioso |

**Formato del mensaje**:
> "¡Ay, qué bien, Paula! ¡Qué bueno que curaste al perrito con una venda en la pata! Eres una veterinaria muy especial. ❤️"

Cada mensaje:
- Menciona el animal curado
- Menciona el tratamiento usado
- Tiene emojis/emoticones
- Se lee en voz alta con TTS

---

## Minijuegos de Vocabulario (Pantallas de Carga)

Aparecen entre niveles durante 5-10 segundos. Cada pantalla de carga:
- Enseña 1-3 palabras nuevas del vocabulario del siguiente bioma
- No bloquea — el nivel carga en paralelo
- Paula puede tocar las palabras para escucharlas

**Tipos de minijuegos**:
1. **Ruleta de palabras**: Gira y aparece palabra + imagen
2. **Tarjeta flash**: Muestra imagen, Paula toca para voltear y ver la palabra
3. **Sigue la palabra**: Palabra resaltada que se lee en voz alta

---

## Flujo de un Nivel (Game Loop)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  1. Setup   │────→│ 2. Discovery │────→│ 3. Diagnose │
│  (cargar    │     │  Paula ve    │     │  Lee qué    │
│   escena)   │     │  al animal   │     │  le pasa    │
└─────────────┘     └──────────────┘     └─────────────┘
                                                │
                        ┌───────────────────────┘
                        ▼
               ┌─────────────────┐
               │ 4. Treatment    │
               │ Mecánica de     │
               │ lectura activa  │
               └─────────────────┘
                        │
           ┌────────────┼────────────┐
           ▼            ▼            ▼
      ┌────────┐  ┌─────────┐  ┌──────────┐
      │Correct │  │ Correct │  │ Correct  │
      │ Step 1 │→→│ Step 2  │→→│ Step 3   │
      └────────┘  └─────────┘  └──────────┘
           │            │            │
           └────────────┴────────────┘
                        │
                        ▼
               ┌─────────────────┐
               │ 5. Heal         │
               │ Animación del   │
               │ animal sano     │
               └─────────────────┘
                        │
                        ▼
               ┌─────────────────┐
               │ 6. Celebrate    │
               │ Mensaje de      │
               │ familiar + TTS  │
               └─────────────────┘
                        │
                        ▼
               ┌─────────────────┐
               │ 7. Unlock Next  │
               │ Mapa actualizado│
               └─────────────────┘
```

---

## Componentes React Principales

### 1. `App.jsx`
- Router de estados: home → map → loading → game → celebration
- Estado global: nivel actual, progreso, configuración

### 2. `HomeScreen`
- Título animado "Veterin Paula"
- Botón "Jugar" grande
- Botón "Elegir Nivel" (desbloquea después del nivel 5)
- Música de fondo suave

### 3. `MapScreen`
- Mapa visual con 4 biomas como zonas
- Cada nivel es un punto en el camino
- Niveles bloqueados en gris, desbloqueados coloridos
- Paula camina animada al nivel seleccionado

### 4. `LoadingScreen`
- Minijuego de vocabulario interactivo
- Barra de carga real del siguiente nivel
- Palabras del próximo bioma

### 5. `CelebrationScreen`
- Foto/avatar del familiar
- Globo de diálogo con mensaje
- Botón "Siguiente nivel"
- Confeti/estrellas animadas

### 6. `GameCanvas`
- Wrapper de React que monta el Canvas
- Recibe: `levelId`, `mechanicType`, `onComplete`, `onFail`
- Renderiza: `<canvas>` con el game loop

---

## Game Engine (Canvas)

### Sistema de Entidades

```javascript
// Base Entity
class Entity {
  constructor(x, y, width, height) {
    this.x = x; this.y = y;
    this.width = width; this.height = height;
    this.visible = true;
  }
  update(dt) {}
  render(ctx) {}
}

// Paula (player avatar)
class Paula extends Entity {
  constructor(x, y) {
    super(x, y, 80, 120);
    this.state = 'idle'; // idle, walk, interact, celebrate
    this.direction = 'right';
  }
}

// Animal
class Animal extends Entity {
  constructor(x, y, type, injury) {
    super(x, y, 100, 100);
    this.type = type;       // 'dog', 'cat', etc.
    this.state = 'hurt';    // hurt, healing, happy
    this.injury = injury;   // 'paw', 'ear', 'tail'
  }
}

// Interactive Button (for reading mechanics)
class WordButton extends Entity {
  constructor(x, y, word, isCorrect) {
    super(x, y, 150, 60);
    this.word = word;
    this.isCorrect = isCorrect;
    this.hovered = false;
  }
}
```

### Game Loop

```javascript
function gameLoop(timestamp) {
  const dt = timestamp - lastTimestamp;
  
  // Update
  currentScene.update(dt);
  
  // Render
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  currentScene.render(ctx);
  
  requestAnimationFrame(gameLoop);
}
```

### Escenas

1. **`DiscoveryScene`**: Paula camina hacia el animal, se detiene, zoom suave
2. **`DiagnosisScene`**: Texto aparece con TTS, animal muestra la herida
3. **`TreatmentScene`**: Mecánica de lectura activa (varía por fase)
4. **`HealingScene`**: Animación de curación, partículas, animal se pone feliz

---

## Mecánicas de Lectura (Implementación)

### Fase 1: Elegir Palabra (Niveles 1-12)

```javascript
class ChooseWordMechanic {
  constructor(options, correctWord) {
    this.buttons = options.map(word => 
      new WordButton(x, y, word, word === correctWord)
    );
  }
  
  onTouch(button) {
    if (button.isCorrect) {
      this.onSuccess();
    } else {
      this.onFail(); // Vibración + sonido de error suave
    }
  }
}
```

### Fase 2: Formar Sílabas (Niveles 13-25)

```javascript
class BuildSyllablesMechanic {
  constructor(syllables, targetWord) {
    this.syllables = shuffle(syllables);
    this.target = targetWord;
    this.building = [];
  }
  
  onTouch(syllable) {
    this.building.push(syllable);
    if (this.building.join('') === this.target) {
      this.onSuccess();
    }
  }
}
```

### Fase 3: Instrucciones Paso a Paso (Niveles 26-38)

```javascript
class FollowInstructionsMechanic {
  constructor(steps) {
    this.steps = steps; // ['lava', 'venda', 'medicina']
    this.currentStep = 0;
  }
  
  onTouch(step) {
    if (step === this.steps[this.currentStep]) {
      this.currentStep++;
      if (this.currentStep >= this.steps.length) {
        this.onSuccess();
      }
    }
  }
}
```

### Fase 4: Combinación Avanzada (Niveles 39-50+)

Combina mecánicas anteriores + lectura de oraciones completas.

---

## Datos de Niveles

```javascript
// src/data/levels.js
export const levels = [
  {
    id: 1,
    biome: 'home',
    animal: 'dog',
    injury: 'paw',
    mechanic: 'choose_word',
    question: 'El perrito tiene la pata lastimada. ¿Qué necesita?',
    options: ['VENDA', 'HUESO', 'AGUA'],
    correct: 'VENDA',
    vocabulary: ['pata', 'venda', 'herida'],
    celebrationFrom: 'Mamá',
    celebrationMessage: '¡Qué bueno que curaste al perrito con una venda en la pata!'
  },
  // ... 50+ niveles
];
```

---

## Audio

### Música
- Home: Melodía suave, acústica, alegre
- Bioma Casa: Música de barrio, cálida
- Bioma Granja: Country/folk suave
- Bioma Bosque: Naturaleza, flauta dulce
- Bioma Selva: Ritmo tropical suave

### Efectos de Sonido
- Click/tap: Pop suave
- Correcto: Campana alegre
- Incorrecto: Buzz suave (no frustrante)
- Curación: Chispas mágicas
- Celebración: Aplausos + fanfarria corta

### TTS (Web Speech API)
```javascript
function speak(text, rate = 0.8) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = rate; // Más lento para niños
  utterance.pitch = 1.2; // Voz más aguda, amigable
  speechSynthesis.speak(utterance);
}
```

---

## Arte

### Estilo Visual
- Ilustraciones tipo cuento infantil
- Colores cálidos y pastel (no neón, no oscuro)
- Personajes con ojos grandes y expresivos
- Bordes redondeados en todo
- Sin gradients agresivos

### Paleta de Colores Sugerida
| Uso | Color |
|-----|-------|
| Fondo principal | `#FFF8F0` (crema cálido) |
| Primario | `#FF9AA2` (rosa suave) |
| Secundario | `#A0E7E5` (turquesa) |
| Acento | `#FFDac1` (melocotón) |
| Texto | `#5D4037` (marrón cálido) |
| Éxito | `#B5EAD7` (verde menta) |
| Error | `#FFB7B2` (rosa error suave) |

### Sprites Necesarios
- Paula (idle, walk, interact, celebrate)
- Animales (herido, healing, happy) × 24 tipos
- Fondos (4 biomas × 3 variantes)
- UI (botones, marcos, íconos)
- Partículas (corazones, estrellas, chispas)

---

## Accesibilidad

- **Texto grande**: Mínimo 24px para palabras, 18px para UI
- **Botones grandes**: Mínimo 60×60px para touch
- **Contraste alto**: Texto oscuro sobre fondo claro
- **TTS en todo**: Cada palabra se puede tocar para escuchar
- **Sin tiempo límite**: Nunca se pierde por tardar
- **Retroalimentación visual + sonora**: Siempre ambas
- **Sin texto obligatorio para jugar**: Imagen + palabra siempre juntas

---

## Responsive

- **Desktop**: Canvas centrado, UI alrededor
- **iPad**: Fullscreen, controles táctiles optimizados
- **Teléfono**: Portrait, Canvas ajustado, UI stacked
- **Orientación**: Portrait preferido, landscape soportado

---

## Estructura de Archivos Final

```
veteripaula/
├── public/
│   ├── index.html
│   └── assets/
│       ├── images/
│       │   ├── animals/         # 24 animales × 3 estados
│       │   ├── characters/      # Paula, 6 familiares
│       │   ├── backgrounds/     # 4 biomas
│       │   ├── ui/              # Botones, marcos, íconos
│       │   └── particles/       # Corazones, estrellas
│       ├── audio/
│       │   ├── music/           # 5 pistas
│       │   └── sfx/             # ~15 efectos
│       └── fonts/               # Fuente amigable para niños
├── src/
│   ├── components/
│   │   ├── ui/                  # Button, Dialog, StarRating
│   │   ├── screens/
│   │   │   ├── HomeScreen.jsx
│   │   │   ├── MapScreen.jsx
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── CelebrationScreen.jsx
│   │   │   └── SettingsScreen.jsx
│   │   └── game/
│   │       └── GameCanvas.jsx   # Wrapper React del Canvas
│   ├── game-engine/
│   │   ├── GameLoop.js
│   │   ├── CanvasRenderer.js
│   │   ├── entities/
│   │   │   ├── Entity.js
│   │   │   ├── Paula.js
│   │   │   ├── Animal.js
│   │   │   └── WordButton.js
│   │   ├── scenes/
│   │   │   ├── DiscoveryScene.js
│   │   │   ├── DiagnosisScene.js
│   │   │   ├── TreatmentScene.js
│   │   │   └── HealingScene.js
│   │   └── mechanics/
│   │       ├── ChooseWord.js
│   │       ├── BuildSyllables.js
│   │       ├── FollowInstructions.js
│   │       └── CombinedMechanic.js
│   ├── data/
│   │   ├── levels.js            # Los 50+ niveles
│   │   ├── vocabulary.js        # Palabras por bioma
│   │   ├── characters.js        # Diálogos de familiares
│   │   └── biomeConfig.js       # Config de cada bioma
│   ├── hooks/
│   │   ├── useGameState.js
│   │   ├── useAudio.js
│   │   ├── useTTS.js
│   │   └── useProgress.js
│   ├── utils/
│   │   ├── shuffle.js
│   │   ├── lerp.js
│   │   ├── clamp.js
│   │   └── storage.js           # localStorage wrapper
│   ├── styles/
│   │   └── global.css
│   └── App.jsx
├── tests/
│   └── e2e/
│       └── game.spec.js         # Playwright tests
├── docs/
│   └── specs/
│       └── 2026-05-19-veterin-paula-design.md
├── vite.config.js
├── package.json
└── README.md
```

---

## Criterios de Éxito

- [ ] Paula puede completar el nivel 1 sin ayuda en < 2 minutos
- [ ] TTS funciona en Safari iPad
- [ ] Cada nivel enseña al menos 1 palabra nueva
- [ ] Celebraciones aparecen consistentemente cada 2 niveles
- [ ] Minijuegos de vocabulario aparecen en todas las pantallas de carga
- [ ] Progreso se guarda en localStorage
- [ ] Juego funciona en iPad Air + Chrome Desktop + Safari Mobile
- [ ] Playwright tests pasan para niveles 1, 13, 26, 39 (uno por bioma)

---

## Open Questions

1. ¿Usar imágenes generadas (IA) o simples formas geométricas coloridas para el MVP?
2. ¿Necesitamos una pantalla de "perfil" donde Paula vea sus logros?
3. ¿Queremos que los padres puedan ver el progreso de lectura de Paula?
4. ¿Incluir sistema de recompensas tipo stickers/insignias?

---

## Próximos Pasos (Fases de Implementación)

1. **FASE 1**: Setup React + Vite + Canvas wrapper + estructura de carpetas
2. **FASE 2**: Game engine base (loop, entities, renderer)
3. **FASE 3**: Mecánica "elegir palabra" + nivel 1 completo
4. **FASE 4**: Niveles 1-12 (Bioma Casa) + celebraciones Mamá/Papá
5. **FASE 5**: Minijuegos de vocabulario + pantallas de carga
6. **FASE 6**: Mecánica "formar sílabas" + niveles 13-25 (Granja)
7. **FASE 7**: Mecánica "instrucciones paso a paso" + niveles 26-38 (Bosque)
8. **FASE 8**: Mecánica combinada + niveles 39-50+ (Selva)
9. **FASE 9**: Audio (música + SFX + TTS)
10. **FASE 10**: Arte final + animaciones + polish
11. **FASE 11**: Testing Playwright + accesibilidad + responsive
12. **FASE 12**: Deploy a GitHub Pages
