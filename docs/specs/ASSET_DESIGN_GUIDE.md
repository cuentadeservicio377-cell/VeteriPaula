# VeteriPaula — Asset Design Guide

> Documento para diseñador/ilustrador. También sirve como spec para el pixel art procedural actual.
> Versión: 1.0 | Fecha: 2026-05-23

---

## 🎨 Estilo Visual

### Dirección de Arte
- **Estilo**: Pixel art "cute" / kawaii con influencia Avatar World / Roblox
- **Proporciones**: Cabezas grandes (40% del sprite), cuerpos pequeños, ojos expresivos
- **Paleta**: Colores cálidos, pastel, saturación media-alta
- **Línea**: Líneas limpias, bordes redondeados, sin anti-aliasing
- **Tamaño base**: 24×20px para personajes, escalados 5x-8x en pantalla

### Paleta Global

```
PAULA:
  Piel:       #FFDAB9 (melocotón claro)
  Cabello:    #8B4513 (castaño)
  Bata:       #FFFFFF (blanco) + #FF6B6B (acento rosa)
  Ojos:       #4A3728 (marrón oscuro)
  Rubor:      #FFB6C1 (rosa suave)

ANIMALES:
  Perro:      #D2691E + #F4A460
  Gato:       #FF8C00 + #FFA500
  Conejo:     #FFF8DC + #FFB6C1
  Pájaro:     #87CEEB + #FFD700
  Tortuga:    #228B22 + #8FBC8F

UI:
  Fondo:      Gradiente por bioma (ver abajo)
  Botones:    #FFFFFF con borde #5D4037
  Correcto:   #B5EAD7 (verde menta)
  Error:      #FF9AA2 (rosa salmón)
  Texto:      #5D4037 (marrón cálido)
  Acento:     #FFD700 (dorado)

BIOMES:
  Clínica:    #FFF5F5 → #FFE4E1 | ground: #FFCDD2
  Granja:     #FFFBF0 → #FFF3E0 | ground: #FFE0B2
  Bosque:     #F0FFF4 → #E8F5E9 | ground: #C8E6C9
  Selva:      #F0FDFA → #E0F2F1 | ground: #B2DFDB
```

---

## 👩‍⚕️ PAULA — La Veterinaria

### Descripción
Paula tiene 6 años, pelo castaño en dos coletas, usa bata de veterinaria blanca con un corazón rosa. Es amable, curiosa y animada.

### Sprites Requeridos

#### 1. Idle (24×20px)
- Postura: De pie, manos a los lados, leve respiración
- Expresión: Sonrisa suave, ojos abiertos, mirada amigable
- Detalles: Coletas visibles, bata con corazón rosa en el pecho

#### 2. Walk (24×20px) — 2 frames
- Frame 1: Pierna izquierda adelante, brazos balanceándose
- Frame 2: Pierna derecha adelante
- Expresión: Determinada pero feliz

#### 3. Celebrate (24×20px) — 2 frames
- Frame 1: Brazos arriba, saltando, ojos cerrados de felicidad
- Frame 2: Brazos arriba, en el aire, sonrisa grande
- Detalles: Pueden aparecer pequeñas estrellas alrededor

#### 4. Pointing (24×20px)
- Postura: Un brazo extendido señalando hacia adelante/arriba
- Expresión: Atenta, ayudando
- Usado: Cuando da hints al niño

#### 5. Worried (24×20px)
- Postura: Manos juntas cerca del pecho, cabeza ladeada
- Expresión: Cejas arqueadas hacia abajo, boca pequeña "o"
- Usado: Cuando el niño se equivoca

#### 6. Curing (24×20px)
- Postura: Agachada, aplicando venda/curando animal
- Expresión: Concentrada pero sonriente
- Usado: Durante la animación de tratamiento

### Animaciones Requeridas
- **Idle**: Loop suave de respiración (±2px en Y)
- **Walk**: Loop de 2 frames, 200ms por frame
- **Celebrate**: Loop de 2 frames, 150ms por frame, con partículas
- **Pointing**: Estático, con línea animada que va de Paula al objetivo
- **Worried → Idle**: Transición de 500ms
- **Entrada**: Camina desde fuera de pantalla hacia posición (1.2s, easeOutBack)
- **Salto**: Paula salta cuando el niño acierta (250ms up, 300ms down bounce)

---

## 🐕 PIPO — El Perrito (Nivel 1)

### Descripción
Pipo es un perro cocker spaniel pequeño, color canela, con orejas largas y caídas. Se lastimó la pata derecha trasera.

### Sprites Requeridos

#### 1. Lying Down (18×16px)
- Postura: Acostado sobre su costado izquierdo, pata derecha doblada
- Expresión: Ojos medio cerrados, cejas hacia abajo (triste)
- Detalle: Venda roja alrededor de la pata lastimada (visible)
- Accesorio: Pequeña gota de sudor/frío cerca de la cabeza

#### 2. Head Up (18×16px)
- Postura: Mismo lying down pero cabeza levantada
- Expresión: Ojos abiertos, mirada esperanzada
- Usado: Cuando el niño toca su cabeza o cuando escucha a Paula

#### 3. Sitting Happy (18×16px) — 2 frames
- Frame 1: Sentado, cola a la derecha
- Frame 2: Sentado, cola a la izquierda (para animación de wag)
- Expresión: Ojos felices, lengua fuera, orejas levantadas
- Detalle: Pata ya vendada (venda blanca limpia)

#### 4. Healed (18×16px) — 2 frames
- Frame 1: De pie, mirando hacia adelante
- Frame 2: De pie, mirando hacia arriba (saltito pequeño)
- Expresión: Muy feliz, ojos brillantes

#### 5. Eating Bone (18×16px) — Bonus
- Postura: Acostado, hueso entre las patas
- Expresión: Contento, masticando
- Usado: Cuando el niño toca "HUESO" (respuesta incorrecta divertida)

### Animaciones Requeridas
- **Idle (lying)**: Respiración suave, parpadeo cada 2-3s
- **Tail wag**: Loop de 2 frames, velocidad aumenta con felicidad
- **Head shake**: Cuando respuesta incorrecta, rotación rápida ±8°
- **Heal transition**: Lying → Sitting Happy en 1.5s con partículas
- **Petting reaction**: Corazones flotando, cola wag rápido
- **Ouch**: Brillo rojo breve en la pata lastimada al tocarla

### Touch Zones (Hitboxes Visuales)
```
Cabeza:  x:15% y:10% w:70% h:35%  → Reacción: levanta cabeza, sniff
Cuerpo:  x:10% y:40% w:80% h:35%  → Reacción: sniff, ronroneo equivalente
Pata:    x:60% y:75% w:35% h:20%  → Reacción: ouch, brillo rojo
```

---

## 🐾 ANIMALES GENÉRICOS (Niveles 2-20)

### Por Bioma

#### Clínica (Niveles 1-5)
- Perro (Pipo) — Ya definido
- Gato — Naranja, orejas puntiagudas, cola larga
- Conejo — Blanco, orejas largas, nariz rosa
- Pájaro — Azul/amarillo, alas dobladas (herido)
- Tortuga — Verde, caparazón con patrones

#### Granja (Niveles 6-10)
- Vaca — Blanca con manchas negras, campana
- Gallina — Blanca, cresta roja, alas pequeñas
- Caballo — Marrón, crin oscura, grande
- Oveja — Esponjosa blanca, cara sonriente
- Pato — Amarillo, pico naranja, ala rota

#### Bosque (Niveles 11-15)
- Zorro — Naranja, cola grande y esponjosa
- Ardilla — Marrón, cola grande, hambrienta
- Erizo — Marrón oscuro, espinas negras
- Búho — Marrón, ojos grandes, gafas opcionales
- Ciervo — Marrón claro, cuernos, elegante

#### Selva (Niveles 16-20)
- Mono — Marrón, cola larga, travieso
- Tucán — Negro, pico enorme arcoíris
- Jaguar — Naranja con manchas negras, fuerte
- Tortuga Marina — Verde azulado, aletas
- Delfín — Azul, sonrisa, aleta lastimada

### Estados por Animal (mínimo)
Cada animal necesita:
1. **Hurt** — Con la lesión visible (venda, mancha, etc.)
2. **Healing** — Proceso de curación (partículas, cambio gradual)
3. **Happy** — Curado, sonriente, animado
4. **Confused** — Cuando respuesta incorrecta (head tilt, "?" bubble)

---

## 🎒 ITEMS / OBJETOS

### Items de Tratamiento
```
VENDA:      Rollo blanco con Cruz roja, 16×16px
HUESO:      Hueso de perro marrón claro, 16×16px
AGUA:       Botella azul con gota, 16×16px
MEDICINA:   Frasco rojo con + blanco, 16×16px
CEPILLO:    Cepillo azul con cerdas, 16×16px
TOALLA:     Toalla blanca doblada, 16×16px
ABRIGO:     Manta rosa/celeste, 16×16px
CALOR:      Estufa/manta térmica naranja, 16×16px
PINZAS:     Pinzas plateadas, 16×16px
SOL:        Sol amarillo sonriente, 16×16px
```

### UI Icons (8×8px, escalados 4x)
```
Star:       Estrella dorada con brillo
Heart:      Corazón rojo
Sound:      Altavoz con ondas
Book:       Librito abierto
Home:       Casa simple
Arrow:      Flecha direccional
Pause:      Dos barras verticales
Check:      Checkmark verde
```

---

## 🌍 BACKGROUNDS POR BIOMA

### Especificaciones
- **Resolución**: 800×600px base, escalable
- **Estilo**: Plano 2D, capas parallax opcionales
- **Colores**: Ver paleta de biomas arriba

### Clínica (Nivel 1)
- **Fondo**: Paredes blancas con azulejos rosados suaves
- **Suelo**: Baldosas claras, reflejo sutil
- **Mobiliario**: Mesa de examen, armario de medicinas (siluetas lejanas)
- **Ventana**: Visible, luz natural entrando, nubes suaves
- **Decoración**: Plantas, póster de anatomía animal (simpático)

### Granja
- **Fondo**: Granero rojo, cerca de madera
- **Suelo**: Pasto verde, heno disperso
- **Cielo**: Azul con nubes esponjosas

### Bosque
- **Fondo**: Árboles altos, luz filtrada
- **Suelo**: Hojas, musgo, setas
- **Atmósfera**: Mágico, luciérnagas opcionales

### Selva
- **Fondo**: Plantas tropicales, lianas
- **Suelo**: Arena/hojas húmedas
- **Atmósfera**: Colorido, vibrante, flores exóticas

---

## 👨‍👩‍👧 FAMILIARES (Pantalla de Celebración)

### Characters (24×24px cada uno)
```
Mamá:    Pelo largo oscuro, blusa rosa, expresión cariñosa ❤️
Papá:    Pelo corto, camisa azul, expresión animada 🎉
Abuelo:  Pelo blanco, anteojos, suéter verde, expresión tranquila 🌿
Abuela:  Pelo canoso recogido, blusa lila, expresión dulce 🤗
Bubu:    Barba, camiseta roja, expresión energética 💪
Bibi:    Sin barba, camiseta amarilla, expresión creativa 🎨
```

### Cada familiar necesita:
- Sprite estático (suficiente para v1)
- Opcional: 2 frames de animación idle (respiración)

---

## 🎬 ANIMACIONES ESPECIALES

### Intro del Nivel
1. Paula entra caminando desde la izquierda (1.2s)
2. Animal aparece/está en posición
3. Paula se detiene, mira al animal, expresión worried
4. Paula habla (TTS) presentando el problema

### Selección Correcta
1. Botón resplandeciente + sonido "ding"
2. Item (venda/etc) se anima volando hacia el animal (0.55s)
3. Item "pega" en la lesión, crece con pop-in (0.25s)
4. Animal cambia a estado healing → happy
5. Paula salta y celebra
6. Partículas: confetti, corazones, estrellas (80 partículas nivel 1)
7. Screen shake ligero + flash blanco
8. Paula dice celebración (TTS)
9. Delay 1.6s → pantalla de celebración

### Selección Incorrecta (Nivel 1)
1. Botón tiembla (shake 12px, 500ms)
2. Sonido "nope" amigable
3. Animal: head shake + burbuja "🤔"
4. Paula: expresión worried + señala pata lastimada
5. Paula explica: "¡Un hueso es para comer! Pipo necesita una venda"
6. Highlight correcto aparece automáticamente después de 2.5s

### Anti-Frustración (progresivo)
- **8s sin acción**: Hint nivel 1 (botón correcto brilla)
- **30s**: Paula señala la lesión + habla
- **45s**: Paula dice la palabra correcta + highlight fuerte
- **60s**: Paula repite + hint máximo
- **90s**: Auto-complete (1 estrella)

---

## 📐 ESPECIFICACIONES TÉCNICAS

### Formatos de Entrega
- **Sprites**: PNG con transparencia, 24×20px o 18×16px
- **Animaciones**: Sprite sheets PNG, filas = estados, columnas = frames
- **Backgrounds**: PNG o JPG, 800×600px mínimo
- **Icons**: PNG, 8×8px o 16×16px

### Optimización
- Todos los assets deben pesar < 500KB en total
- Preferir sprite sheets sobre imágenes individuales
- Usar paleta limitada (máximo 32 colores por sprite)

### Integración Actual (Pixel Art Procedural)
Mientras no haya sprites finales, el motor usa `PixelSprite` con matrices de caracteres:
- Cada letra = un color de la paleta
- "T" = transparente
- Frames definidos como arrays de strings
- Escalado 5x-8x en renderizado Canvas

---

## ✅ CHECKLIST DE ASSETS POR NIVEL

### Nivel 1 (Pipo el perrito)
- [x] Paula: idle, walk, celebrate, pointing, worried
- [x] Pipo: lying_down, head_up, sitting_happy, healed
- [x] Item: VENDA (sprite + animación fly)
- [x] Item: HUESO (sprite para respuesta incorrecta)
- [x] Background: Clínica
- [x] UI: Botones con iconos
- [x] Partículas: confetti, corazones, estrellas
- [ ] Paula: curing state (para animación de aplicar venda)
- [ ] Pipo: eating bone state (respuesta incorrecta divertida)

### Nivel 2+ (Template)
Por cada nivel necesitar:
- [ ] Animal: hurt, healing, happy states
- [ ] Items de tratamiento (1-3)
- [ ] Background del bioma
- [ ] Mecánica específica (botones/sílabas/pasos)

---

## 🔄 FLUJO DE TRABAJO CON DISEÑADOR

1. **Entrega inicial**: Sprites del Nivel 1 (Paula, Pipo, items, bg)
2. **Revisión**: Test en el juego, feedback de timing/colores
3. **Iteración**: Ajustes basados en feedback
4. **Aprobación Nivel 1**: Lock del estilo visual
5. **Batch producción**: Animales restantes en grupos de 4-5
6. **Integración**: Reemplazar PixelSprite por ImageSprite en código

---

*Documento vivo — se actualiza con cada iteración*
