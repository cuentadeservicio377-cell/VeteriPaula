# Veterin Paula v2.0 — Plan de Rediseño

> **Fecha:** 2026-05-19  
> **Enfoque:** Evolution (mantener motor Canvas 2D + React, rehacer experiencia)  
> **Niveles:** 20 de alta calidad (vs 50 mediocres)  
> **Bloques:** 4 bloques de 5 niveles (1 bioma = 1 bloque)

---

## 🎯 Principios de Diseño v2.0

1. **Drag & drop es la reina** — 80% de las interacciones
2. **Cada toque produce algo** — nada de pantallas muertas
3. **Sin game over** — reintentos infinitos, pistas automáticas
4. **La lectura ES la cura** — no un mini-game separado
5. **Feedback exagerado y multisensorial** — confetti, sonidos, vibración, celebraciones
6. **Paula reacciona emocionalmente** — no es un muñeco estático
7. **20 niveles únicos > 50 repetidos** — cada nivel tiene algo distintivo
8. **Bloques de 5 niveles** — casa → granja → bosque → selva, desbloqueables

---

## 📦 Estructura de Bloques (20 Niveles)

### Bloque 1: La Clínica de Paula (Niveles 1-5) — Casa/Barrio
**Mecánica:** Elegir palabra correcta (tap) + introducción  
**Objetivo:** Vocales + consonantes simples (m, p, s, l)  
**Animales:** Perro 🐕, Gato 🐈, Conejo 🐇, Pájaro 🐦, Tortuga 🐢

| Nivel | Animal | Lesión | Lectura | Nuevo sonido |
|-------|--------|--------|---------|-------------|
| 1 | Perro | Pata lastimada | Tocar "VENDA" de 2 opciones | /a/, /e/ |
| 2 | Gato | Oreja sucia | Tocar "AGUA" de 2 opciones | /i/, /o/ |
| 3 | Conejo | Ojo irritado | Tocar "MEDICINA" de 3 opciones | /u/, /m/ |
| 4 | Pájaro | Ala rota | Arrastrar sílabas "A-LA" | /p/, /l/ |
| 5 | Tortuga | Caparazón sucio | Seguir pasos: LAVA → SECA | /s/, revisión |

### Bloque 2: La Granja (Niveles 6-10) — Desbloquea al completar Bloque 1
**Mecánica:** Formar sílabas con drag & drop (principal)  
**Objetivo:** Sílabas abiertas (ma, me, mi, mo, mu, pa, pe...)
**Animales:** Vaca 🐄, Gallina 🐔, Caballo 🐴, Oveja 🐑, Pato 🦆

| Nivel | Animal | Lectura | Nuevas sílabas |
|-------|--------|---------|---------------|
| 6 | Vaca | Arrastrar "VA-CA" | va, ca |
| 7 | Gallina | Arrastrar "GA-LLI-NA" | ga, lli, na |
| 8 | Caballo | Arrastrar "CA-BAL-LO" | bal, lo |
| 9 | Oveja | Arrastrar "O-VE-JA" | ve, ja |
| 10 | Pato | Arrastrar "PA-TO" | to |

### Bloque 3: El Bosque Mágico (Niveles 11-15) — Desbloquea al completar Bloque 2
**Mecánico:** Instrucciones paso a paso con drag & drop de objetos  
**Objetivo:** Palabras compuestas + comprensión de instrucciones
**Animales:** Zorro 🦊, Ardilla 🐿️, Erizo 🦔, Búho 🦉, Ciervo 🦌

| Nivel | Animal | Instrucción |
|-------|--------|-------------|
| 11 | Zorro | "Primero LAVA la herida, luego pon VENDA, al final dale un ABRAZO" |
| 12 | Ardilla | "Toma el AGUA, luego el CEPIILLO, al final la MEDICINA" |
| 13 | Erizo | "Primero el HIELO, después la VENDA, al final REPOSO" |
| 14 | Búho | "Pon AGUA, luego MEDICINA, al final COMIDA" |
| 15 | Ciervo | "Primero LAVA, luego SECA, al final VENDA" |

### Bloque 4: La Selva (Niveles 16-20) — Desbloquea al completar Bloque 3
**Mecánica:** Combinación de todas + oraciones cortas  
**Objetivo:** Oraciones de 3-5 palabras, sílabas trabajadas
**Animales:** Mono 🐵, Tucán 🐦, Jaguar 🐆, Tortuga Marina 🐢, Delfín 🐬

| Nivel | Animal | Desafío |
|-------|--------|---------|
| 16 | Mono | Leer "El mono tiene hambre. Dale un platano." + arrastrar plátano |
| 17 | Tucán | Leer "El tucán tiene la pata torcida. Pon hielo." |
| 18 | Jaguar | Formar "JA-GUAR" + instrucción "Primero reposo" |
| 19 | Tortuga Marina | Leer oración de 5 palabras + 3 pasos |
| 20 | Delfín | Combinación completa: leer → formar → seguir pasos + celebración final |

---

## 🎨 Cambios Visuales Principales

### Paleta de Colores por Bloque
| Bloque | Primario | Secundario | Acento | Fondo |
|--------|----------|-----------|--------|-------|
| Clínica | #FF6B6B (rojo coral) | #FFE66D (amarillo) | #4ECDC4 (turquesa) | #FFF5F5 |
| Granja | #F7DC6F (amarillo maíz) | #82E0AA (verde pasto) | #E67E22 (naranja) | #FFFBF0 |
| Bosque | #58D68D (verde bosque) | #A569BD (morado seta) | #F4D03F (amarillo luz) | #F0FFF4 |
| Selva | #1ABC9C (verde selva) | #E74C3C (rojo tucán) | #F39C12 (naranja mango) | #F0FDFA |

### Tamaños de Touch Targets
- Botones mínimos: **80×80px** (antes 60×60)
- Áreas de drag: **120×120px**
- Texto de palabras: **48px bold**
- Espacio entre botones: **20px mínimo**

### Animaciones Nuevas
- **Idle**: Paula respira, parpadea, mira al animal
- **Preocupada**: Paula se inclina hacia el animal herido
- **Feliz**: Paula salta, gira, celebra
- **Curando**: Paula extiende la mano, brillo mágico
- **Animal herido**: Temblor suave, lágrima ocasional
- **Animal curado**: Saltos, giros, corazones flotando
- **Celebración**: Confetti, estrellas, pantalla brilla

---

## 🔊 Audio Rediseñado

### Efectos de Sonido (Web Audio API mejorado)
| Evento | Sonido |
|--------|--------|
| Tocar/letra correcta | "Ding" cristalino + brillo visual |
| Tocar/letra incorrecta | "Boing" suave + vibración leve |
| Sílaba correcta | "Pop" alegre |
| Palabra completa | Campana + aplausos cortos |
| Animal curado | Fanfarria + sonido de animal feliz |
| Paula celebra | Risita + "¡Lo logré!" (TTS) |

### Música por Bloque
- Clínica: Xilófono suave, ritmo de cuna
- Granja: Guitarra acústica, gallos de fondo
- Bosque: Flauta dulce, pájaros, viento
- Selva: Maracas, bongos, tropical suave

### Voz / TTS
- Paula "piensa en voz alta": "¿Qué necesita el perrito? Veamos... ¡VENDA!"
- Animal habla: "¡Guau! ¡Gracias Paula!" (TTS con pitch modificado)
- Instrucciones siempre con voz al inicio del nivel
- Velocidad TTS: lenta (0.7x) para niños

---

## 🎮 Mecánicas Rediseñadas

### Mecánica 1: Elegir Palabra (Tap)
**Antes:** Botones estáticos, tocas y cambia de color  
**Ahora:** 
- Palabras flotan suavemente (idle animation)
- Al tocar: palabra se agranda (scale 1.3), brilla, dice su sonido
- Si correcta: vuela hacia el animal, se transforma en el objeto
- Si incorrecta: se sacude (shake), dice "¡Casi!", vuelve a flotar

### Mecánica 2: Formar Sílabas (Drag & Drop)
**Antes:** Tocar sílabas en orden  
**Ahora:**
- Sílabas son bloques redondeados que flotan
- Arrastras con dedo/mouse, se pegan magnéticamente al slot correcto
- Al arrastrar: sílaba dice su sonido ("¡pa!")
- Al soltar en slot correcto: "click" satisfactorio, sílaba brilla
- Al completar: palabra cobra vida (se convierte en objeto animado)

### Mecánica 3: Seguir Instrucciones (Drag objetos)
**Antes:** Tocar pasos en orden  
**Ahora:**
- Objetos visuales (venda, agua, medicina, cepillo) en bandeja
- Instrucción aparece con voz: "Primero lava con AGUA"
- Niño arrastra el objeto AGUA al animal
- Animal reacciona: "¡Ahh, fresco!"
- Siguiente instrucción aparece automáticamente

---

## 🏗️ Arquitectura Técnica v2.0

### Librerías Nuevas
```json
{
  "dependencies": {
    "react": "^19",
    "react-dom": "^19",
    "framer-motion": "^11",        // Animaciones React (pantallas)
    "popmotion": "^11",            // Tweening para Canvas
    "canvas-confetti": "^1.9"      // Confetti de celebración
  }
}
```

### Sistema de Tweening (Popmotion)
```javascript
// Animar posición con easing
animate({
  from: { x: 0, y: 0, scale: 1 },
  to: { x: 100, y: 200, scale: 1.5 },
  duration: 800,
  ease: easing.easeOutBounce,
  onUpdate: (v) => entity.set(v)
});
```

### Sistema de Drag & Drop
```javascript
// Drag con magnetismo a slots
const drag = new Draggable(syllable, {
  snapTo: slots,
  magnetDistance: 40,
  onDrag: () => playSound('drag'),
  onSnap: (slot) => checkCorrect(syllable, slot)
});
```

### Componente Animal (mejorado)
```javascript
// Animal con sprite sheet o vector animado
// Estados: idle_sad, idle_happy, healing, celebrating
// Transiciones tweened entre estados
// Micro-reacciones: parpadeo, respiración, orejas moviéndose
```

---

## 📋 Fases de Implementación

### Fase 1: Fundamentos (Semana 1)
- [ ] Instalar librerías: framer-motion, popmotion, canvas-confetti
- [ ] Implementar sistema de tweening en Canvas
- [ ] Implementar sistema de drag & drop
- [ ] Rehacer Paula con animaciones (idle, happy, worried, celebrate)
- [ ] Rehacer Animal con estados tweened
- [ ] Nuevo sistema de partículas (confetti, estrellas, brillo)

### Fase 2: Mecánicas (Semana 2)
- [ ] Rehacer Mecánica 1: Elegir palabra con animaciones ricas
- [ ] Rehacer Mecánica 2: Formar sílabas con drag & drop
- [ ] Rehacer Mecánica 3: Instrucciones con drag de objetos
- [ ] Sistema anti-frustración: pistas, reintentos, adaptación
- [ ] Feedback multisensorial: sonido + visual + vibración

### Fase 3: Niveles (Semana 3)
- [ ] Diseñar y implementar Bloque 1: Clínica (5 niveles)
- [ ] Diseñar y implementar Bloque 2: Granja (5 niveles)
- [ ] Diseñar y implementar Bloque 3: Bosque (5 niveles)
- [ ] Diseñar y implementar Bloque 4: Selva (5 niveles)
- [ ] Sistema de desbloqueo de bloques
- [ ] Galería de animales curados

### Fase 4: Audio & Polish (Semana 4)
- [ ] Música ambiental por bloque
- [ ] Efectos de sonido mejorados
- [ ] TTS con contexto (Paula "piensa en voz alta")
- [ ] Transiciones animadas entre pantallas
- [ ] Responsive pulido (iPad optimizado)
- [ ] Testing con Playwright
- [ ] Deploy

---

## 🎨 Concepto Visual: Antes vs Después

### Antes (v1.0)
- Fondo: gradiente simple
- Paula: círculo + rectángulos (código)
- Animal: círculo + ojos (código)
- Palabras: texto plano en canvas
- Celebración: emojis flotando

### Después (v2.0)
- Fondo: ilustración por bloque (SVG/Canvas con capas)
- Paula: sprite animado o vector con tweening
- Animal: sprite con 3 estados animados
- Palabras: bloques redondeados con sombra, brillo al interactuar
- Celebración: confetti + tweening + sonido + vibración

---

## 🎯 Métricas de Éxito v2.0

- [ ] Paula puede completar nivel 1 sin ayuda en < 1 minuto
- [ ] Un niño de 6 años juega 5 niveles seguidos sin abandonar
- [ ] Cada nivel dura 30-90 segundos
- [ ] Cada interacción tiene feedback visual en < 100ms
- [ ] TTS funciona en Safari iPad
- [ ] El juego carga en < 3 segundos en 4G
- [ ] Tests de Playwright pasan para todos los niveles
