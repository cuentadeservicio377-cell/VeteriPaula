# Iteración Nivel 1 v2 — Mejoras de Interactividad, Velocidad, Pedagogía

## Diagnóstico Honesto del Nivel 1 Actual

### ❌ Problemas de Interactividad
1. **Fase de exploración pasiva**: 6.5s donde Pipo solo está acostado. Un niño de 6 años abandona en 3s.
2. **Touch zones sin propósito pedagógico**: Tocar cabeza/cuerpo/pata es cute pero no enseña nada.
3. **Feedback visual débil**: Botones flotan pero no "rebotan" al tocar. No hay wiggle/squash.
4. **Celebración pasiva**: Esperar 4s o tocar 3 veces no es un mini-juego.
5. **Paula es estática**: No reacciona visualmente a las acciones del niño.

### ❌ Problemas de Velocidad
1. **6.5s de espera** antes de que aparezcan los botones = muerte por aburrimiento.
2. **TTS rate 0.75** = Paula habla como abuela. Necesita 0.9-1.0.
3. **Primer hint a 8s** = el niño ya se frustró. Debe ser a 3s.
4. **Venda vuela en 550ms** = se siente lento. 250ms es suficiente.
5. **1600ms de espera post-venda** = el niño toca la pantalla 3 veces pensando que no pasó nada.
6. **Delay entre niveles**: loading + 100ms + transiciones = fricción innecesaria.

### ❌ Problemas de Pedagogía
1. **"VENDA" vs "HUESO"**: Distractor demasiado obvio. Un perro con pata lastimada no necesita hueso. El niño adivina sin leer.
2. **No hay presentación de letras**: Las vocales /a/ y /e/ se reproducen pero sin conectar con la palabra.
3. **No hay deletreo visual**: Solo TTS. Un niño de 6 años necesita ver + oír.
4. **No hay énfasis en letras nuevas**: ¿Cuál es la /a/ de VENDA? ¿Y la /e/? No se destacan.
5. **Sin repetición espaciada**: La palabra aparece una vez y nunca más.
6. **Sin refuerzo positivo específico**: "¡Bien!" es genérico. Debe ser "¡V de VENDA! ¡A de VENDA!"

---

## Plan de Cambios v2

### 🎯 Interactividad
- [ ] Eliminar fase "explore" pasiva. Pipo es interactivo DESDE EL SEGUNDO 0.
- [ ] Botones con squash/stretch al tocar (feedback físico).
- [ ] Paula reacciona con emojis flotantes según la acción.
- [ ] Celebración interactiva: arrastrar corazones a Pipo (drag, no solo tap).
- [ ] Partículas de "magia" al tocar cualquier botón (incluso el incorrecto).

### ⚡ Velocidad
- [ ] Reducir intro total a 3s máximo.
- [ ] TTS rate 0.9 (más energético).
- [ ] Primer hint a 3s (no 8s).
- [ ] Venda vuela en 250ms.
- [ ] Post-venda: 600ms máximo.
- [ ] Paula salta en 150ms up / 200ms down.
- [ ] Eliminar delay entre niveles (directo a celebración).

### 📚 Pedagogía
- [ ] **FASE 0 (0-2s)**: Presentación de letras nuevas.
  - Letra "A" aparece GRANDE en pantalla, suena /a/, luego se encoge y se une a "VENDA".
  - Letra "E" aparece GRANDE, suena /e/, se une a "VENDA".
  - La palabra completa "VENDA" brilla.
- [ ] **FASE 1 (2-3s)**: Paula pregunta rápido: "Pipo necesita una venda. ¿Qué palabra es?"
- [ ] **FASE 2**: Botones aparecen.
  - Opción correcta: VENDA
  - Opción incorrecta: PATA (distractor plausible: ambas tienen sentido para una pata lastimada)
- [ ] **Al tocar botón**:
  - La palabra se ilumina letra por letra (150ms cada una) con sonido fonético.
  - Correcto: estrella dorada en cada letra nueva (/a/, /e/).
- [ ] **Celebración**:
  - Paula dice: "¡V-E-N-D-A! ¡VENDA! ¡La A de VENDA! ¡La E de VENDA!"

---

## Anti-Patrón Recordatorio
- NO agregar más texto explicativo (los niños de 6 años no leen instrucciones).
- NO hacer que Paula hable más de 5 segundos seguidos.
- NO usar delays fijos largos.
- NO asumir que el niño va a esperar pacientemente.
- NO usar distractors demasiado obvios.
