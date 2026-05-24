# Iteración Nivel 1 v3 — Diagnóstico Brutal + Rediseño

## ❌ Por qué la v2 falló

### Problema 1: El deletreo visual es un desastre
- Aparece en `y: 0.48` — se superpone con la instrucción en `y: 0.38`
- Usa `setTimeout` fuera del game loop — las letras parpadean o no aparecen
- Las letras son pequeñas (18-22px) — un niño de 6 años no las ve en un iPad a 30cm
- No hay conexión entre las letras del deletreo y los botones

### Problema 2: La intro de 3s sigue siendo eterna
- "¡Hola! Pipo se lastimó la pata. ¡Ayúdame a curarlo!" = 8 sílabas = ~2s de TTS
- Luego instrucción: "Pipo se lastimó la pata. ¿Qué necesita?" = 7 sílabas = ~1.5s
- Total: 3.5s de TTS + animaciones = el niño ya tocó la pantalla 5 veces

### Problema 3: PATA vs VENDA es confuso, no desafiante
- "PATA" tiene 4 letras, "VENDA" tiene 5
- Un niño que no lee bien puede elegir PATA porque es más corta
- No hay progresión pedagógica — es adivinanza pura

### Problema 4: La mecánica sigue siendo "tocar botón" = aburrido
- Dos rectáculos blancos flotando
- No hay sensación física
- No hay progresión visual del esfuerzo

---

## 🎯 Rediseño v3 — Principios

1. **0 segundos de espera** — el niño toca inmediatamente
2. **1 palabra a la vez** — no frases completas en TTS
3. **Ver la causa antes de la acción** — Pipo tiene la pata roja VISIBLE
4. **Múltiples pasos pequeños** — no 1 decisión grande
5. **Feedback inmediato y físico** — sonido + vibración + animación en <100ms
6. **Progresión visible** — el niño VE cómo está curando a Pipo

---

## 🎮 Nuevo Flujo del Nivel 1

### Paso 0: Inmediato (0s)
- Paula ya está en posición
- Pipo está acostado con la pata ROJA y BRILLANTE (lesión visible)
- 2 burbujas grandes flotan: VENDA y PATA
- Paula dice: "¡Venda!" (1 palabra, 0.5s)

### Paso 1: Tocar burbuja (inmediato)
- Al tocar cualquier burbuja: squash fuerte + sonido pop + partículas
- La burbuja rebota (física simple)

### Paso 2: Elegir correcta
- VENDA: explota en confeti, la palabra se descompone en letras V-E-N-D-A que vuelan hacia Pipo
- Cada letra suena su fonema al llegar
- PATA: explota con sonido gracioso "boing", burbuja rebota fuera de pantalla, Paula dice "¡No!"

### Paso 3: Curar (progresión visual)
- Cada letra de VENDA que llega a Pipo, la pata se vuelve un poco menos roja
- 5 letras = 5 etapas de curación visibles
- La última letra pone la venda blanca

### Paso 4: Celebración inmediata
- Pipo se levanta inmediatamente (0.3s)
- Paula salta (0.15s)
- Pantalla de celebración aparece en 0.5s (no 1.2s)

---

## 🛠️ Cambios Técnicos

### GameScene.js
- Eliminar toda la fase "explore"
- Paula ya está en posición al inicio (no camina desde fuera)
- Pipo con pata roja brillante (nuevo estado visual)

### TapWord.js — Rediseño completo
- Botones como BURBUJAS redondas (no rectángulos)
- Squash más extremo (0.6 en lugar de 0.85)
- Al tocar incorrecto: rebote físico + sonido + Paula reacciona inmediatamente
- Al tocar correcto: explosión de letras + curación progresiva
- Eliminar deletreo visual complicado

### Levels-v2.js
- Volver a HUESO vs VENDA pero con feedback diferente
- O usar VENDA vs AGUA
- O mejor: mantener PATA vs VENDA pero mejorar el feedback

### NUEVO: Sistema de Curación Progresiva
- Pipo tiene `healProgress` de 0 a 5
- Cada letra que llega incrementa en 1
- Color de la pata cambia: rojo → naranja → amarillo → blanco

---

## ❌ Qué NO hacer en v3
- NO más setTimeout fuera del game loop
- NO más texto explicativo
- NO más deletreo visual estático
- NO más esperas > 0.5s entre acción y reacción
- NO asumir que el niño leerá instrucciones
