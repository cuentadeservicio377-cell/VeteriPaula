# Spec: Nivel 1 Perfecto — "El perrito lastimado"

## Qué hace
Transforma el nivel 1 de un simple "tap-the-word" en una mini-narrativa interactiva donde el niño NOMBRA al perro, lo EXAMINA tocándolo, elige el TRATAMIENTO correcto arrastrando la venda a la pata, y celebra con el perro feliz. Cada segundo tiene feedback multisensorial. Zero dependencia de lectura.

## Requisitos funcionales

### 1. Setup emocional: El perro tiene nombre y historia (0-8s)
- Al entrar, Paula NO camina desde afuera. Ya está junto al perro.
- El perro está acostado, no de pie. Tiene una pata vendada con una tirita roja pequeña.
- El perro tiene un nombre pixelado flotando: "PIPO" (o el nombre que elija el niño en futuros niveles, pero por ahora es Pipo).
- Paula dice: *"¡Hola! Este es Pipo. Se lastimó la patita jugando. ¿Nos ayudas a curarlo?"*
- El perro hace un sonido de gemido suave y mueve la cola tristemente.

### 2. Examen interactivo: Tocar al perro para ver la herida (8-20s)
- El perro es "tocable" en 3 zonas: cabeza, cuerpo, pata lastimada.
- Tocar la cabeza: el perro levanta la cabeza, mueve la cola, hace un sonido suave.
- Tocar el cuerpo: el perro se mueve, hace "sniff sniff".
- Tocar la pata lastimada: la pata se ilumina en rojo suave, el perro hace "au au" suave, y Paula dice *"¡Sí, ahí está la herida!"*.
- Esta fase es opcional — el niño puede ir directo a los botones, pero tocar al perro recompensa con animaciones.

### 3. Selección de tratamiento con iconos grandes (20-35s)
- Dos botones grandes flotan abajo: VENDA (con icono 🩹) y HUESO (con icono 🦴).
- Los botones son 50% más grandes que ahora.
- Al tocar un botón, Paula dice el nombre del objeto: *"¡Venda!"* o *"¡Hueso!"*.
- Al tocar HUESO (incorrecto): el perro sacude la cabeza, Paula dice *"Mmm, eso es para comer, no para curar"*, el botón rebota y vuelve. No hay penalización.
- Al tocar VENDA (correcto): el botón se ilumina verde, suena "¡ding!", y se convierte en un objeto DRAGGABLE.

### 4. Aplicar la venda: Drag & Drop a la pata (35-50s)
- La venda sigue el dedo del niño (drag suave con magnetismo hacia la pata).
- Mientras se arrastra, la venda rota ligeramente y deja un rastro de partículas blancas.
- Al acercarse a la pata (dentro de 80px), la pata brilla en verde y hay un "snap" suave.
- Al soltar sobre la pata: la venda se "pega" con animación de pop-in, la pata se cubre con una venda pixelada, y el perro hace un sonido de alivio.
- Paula dice: *"¡Qué bien! Pipo ya se siente mejor"*.

### 5. Celebración narrativa: Pipo se levanta feliz (50-65s)
- El perro pasa de "acostado" a "sentado" (cambio de sprite state).
- El perro mueve la cola felizmente (animación loop).
- Corazones pixelados flotan desde el perro.
- Paula salta y celebra.
- Aparece el mensaje "¡Muy bien!" con estrellas.
- TTS: *"¡Excelente! Pipo está feliz. ¿Ves cómo mueve la cola?"*

### 6. Recompensa: Animación de caricia (65-80s)
- El perro se queda en pantalla, esperando.
- Aparece un hint sutil: una mano animada acariciando al perro.
- Si el niño toca al perro: el perro hace "guau guau" feliz, más corazones, Paula ríe.
- Esto refuerza la conexión emocional.

### 7. Transición suave al nivel 2 (80-90s)
- Paula dice: *"¿Listo para conocer al siguiente animal?"*
- Aparece botón "Siguiente" con animación de rebote.
- Al tocar, Paula y Pipo salen caminando hacia la izquierda, y el nuevo nivel entra desde la derecha.

## Requisitos no funcionales
- **Performance:** 60fps en iPad Safari. Máximo 50 partículas simultáneas.
- **Audio:** Todo SFX debe reproducirse en <50ms. Web Audio API con AudioContext.
- **Accesibilidad:** Zero dependencia de lectura. Todo tiene icono + audio.
- **Tactilidad:** Áreas táctiles mínimo 60x60px. Anti-finger offset de -28px ya implementado.

## Criterios de aceptación

1. Dado que el niño entra al nivel 1, cuando el nivel carga, entonces ve a Paula junto a Pipo (perro acostado) con nombre flotante y oye la introducción.
2. Dado que el niño toca la cabeza de Pipo, cuando el touch es en la zona de la cabeza, entonces Pipo levanta la cabeza y hace un sonido suave.
3. Dado que el niño toca la pata lastimada, cuando el touch es en la zona de la pata, entonces la pata brilla rojo, Pipo hace "au au", y Paula confirma la herida.
4. Dado que el niño toca el botón HUESO, cuando elige incorrecto, entonces el perro sacude la cabeza, Paula da feedback verbal amable, y el botón rebota sin penalización.
5. Dado que el niño toca el botón VENDA, cuando elige correcto, entonces el botón se convierte en objeto draggable que sigue el dedo.
6. Dado que el niño arrastra la venda cerca de la pata, cuando está dentro de 80px, entonces hay magnetismo suave, la pata brilla verde, y al soltar hay snap con sonido.
7. Dado que la venda se aplica, cuando el snap ocurre, entonces Pipo pasa a estado "sentado feliz", corazones flotan, y Paula celebra.
8. Dado que Pipo está feliz, cuando el niño toca a Pipo, entonces Pipo reacciona con ladridos felices y más corazones.
9. Dado que el nivel está completo, cuando pasan 5 segundos, entonces aparece el botón "Siguiente" y Paula pregunta si está listo.

## Casos de error
| Input / situación | Comportamiento esperado |
|---|---|
| Niño toca en lugar vacío | Nada pasa, Paula no reacciona (anti-frustración) |
| Niño toca HUESO 3 veces | Cada vez mismo feedback amable, sin escalada negativa |
| Niño arrastra venda fuera de la pata | La venda vuelve al centro con tween suave |
| Niño no hace nada por 10s | Paula dice hint: *"Toca a Pipo para ver qué le pasa"* |

## Checklist de implementación

### Fase 1: Pipo (el perro) con zonas táctiles
- [ ] Crear `Pipo.js` — entidad con 3 hitboxes (cabeza, cuerpo, pata)
- [ ] Sprite de Pipo acostado (nuevo estado 'lying_down' en Characters.js)
- [ ] Animación de cola triste vs feliz
- [ ] Nombre flotante "PIPO" pixelado sobre el sprite
- [ ] Sonidos: whine (triste), sniff (cuerpo), ouch (pata), bark-happy (feliz)

### Fase 2: Interacción táctil con Pipo
- [ ] Implementar `handleTouch` en GameScene para detectar zonas del animal
- [ ] Animaciones por zona: cabeza_levanta, cuerpo_se_mueve, pata_brilla
- [ ] Paula responde verbalmente a cada zona

### Fase 3: Botones mejorados
- [ ] Agrandar botones 50% (300x120 en desktop, responsive)
- [ ] Icono más grande y centrado arriba del texto
- [ ] Feedback visual al tocar: escala 0.9 → 1.1 → 1.0 con elasticidad
- [ ] TTS inmediato al tocar cualquier botón (dice el nombre del objeto)

### Fase 4: Drag de venda
- [ ] Crear `DraggableItem.js` — entidad que sigue el dedo
- [ ] Implementar drag con magnetismo suave hacia la pata (80px radio)
- [ ] Partículas blancas mientras se arrastra
- [ ] Glow verde en la pata al acercarse
- [ ] Snap suave con sonido "pop" al soltar correcto
- [ ] Tween de retorno si se suelta lejos

### Fase 5: Aplicación de venda y transformación
- [ ] Sprite de Pipo con venda aplicada (nuevo estado 'healed')
- [ ] Transición suave de 'lying_down' → 'sitting_happy'
- [ ] Sistema de corazones flotantes (ya existe, reutilizar)
- [ ] Paula celebra con salto + TTS

### Fase 6: Post-celebración interactiva
- [ ] Pipo queda en pantalla esperando caricias
- [ ] Mano tutorial animada acariciando (si no interactúa en 5s)
- [ ] Feedback loop: tocar → ladrido + corazones + Paula ríe

### Fase 7: Transición cinematográfica
- [ ] Paula y Pipo caminan hacia la izquierda y salen de pantalla
- [ ] Fundido / wipe hacia el nivel 2
- [ ] Botón "Siguiente" con animación de rebote

### Fase 8: Audio polish
- [ ] Sonido de whine suave al inicio
- [ ] Sonido de sniff al tocar cuerpo
- [ ] Sonido de ouch al tocar pata
- [ ] Sonido de pop al snap de venda
- [ ] Sonido de bark-happy al curar
- [ ] Paula habla en cada fase con tono apropiado

### Tests manuales
- [ ] Probar en iPad Safari (táctil real)
- [ ] Probar que un niño de 5 años puede completarlo sin leer
- [ ] Probar que el nivel se completa en 60-90 segundos
- [ ] Probar que no hay estados bloqueantes
