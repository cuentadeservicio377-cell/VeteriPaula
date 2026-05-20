# Nivel 1 Master Plan — "Pipo el perrito lastimado"
## Objetivo: Tan divertido como Avatar World

### Investigación Avatar World (principios aplicables)
1. **Recompensa cada 3-5 segundos** — nunca dejar al niño sin feedback
2. **Sonidos de personajes** — cada toque produce un sonido/emoción
3. **Misiones atómicas 30-90s** — el nivel completo dura menos de 90 segundos
4. **No-fail philosophy** — no hay "perder", solo "intentar de nuevo" con ayuda
5. **Multisensory feedback** — visual + audio + háptico (vibración) en cada acción
6. **Touch-everything** — todo se puede tocar y reacciona

---

### Flujo Actual del Nivel 1 (auditoría)

| Fase | Duración | Problema |
|------|----------|----------|
| Paula entra caminando | ~2s | ✅ Bien |
| Paula habla (TTS) | ~3s | ✅ Bien |
| Pipo levanta cabeza + queja | ~1s | ✅ Bien |
| Paula pregunta | ~3s | ✅ Bien |
| **Exploración libre** | indefinido | ❌ Pipo pequeño, sin recompensas inmediatas |
| Botones aparecen | ~1s | ✅ Bien |
| Child elige | variable | ❌ Si elige mal, solo "nope" — poco divertido |
| Éxito: venda vuela + Pipo curado | ~3s | ❌ Falta magia visual |
| Celebración | ~3s | ❌ Pipo se sienta pero sin wow factor |
| Petting reward | ~5s | ❌ No implementado visualmente |

---

### Cambios Propuestos

#### 1. SPRITE: Pipo más grande y expresivo
**Problema:** Pipo se ve como una cabeza flotante de ~60×70px. Paula es ~144×120px.
**Solución:** Rediseñar el sprite DOG_LYING para que el perro ocupe más del canvas.
- Aumentar detalle del cuerpo (menos espacio transparente)
- Hacer las orejas más prominentes
- Agregar más filas de cuerpo/patas
- Scale pasar de 8 a 10 si es necesario

#### 2. SONIDO: Cada interacción táctil produce sonido
**Problema:** Durante exploración, tocar a Pipo no da feedback inmediato.
**Solución:** 
- Cabeza: sniff + corazón visual
- Cuerpo: ladrido suave + "🐕" burbuja
- Pata: whine + "🦶" + vibración corta
- Siempre un sonido + partícula visual

#### 3. ANIMACIONES: Idle animations para Pipo
**Problema:** Pipo está estático cuando no se toca.
**Solución:**
- Respiración suave (scaleY oscila 0.98-1.02)
- Parpadeo cada 3-5 segundos
- Orejas se mueven ligeramente
- Cola pequeña que se mueve cuando está feliz

#### 4. NO-FAIL: Mecánica de error más divertida
**Problema:** Elegir HUESO solo dice "nope" y shake del botón.
**Solución:**
- Pipo menea la cabeza ("no no")
- Paula dice "Hmm, un hueso no cura la pata"
- HUESO se convierte en gris/desactivado
- Paula señala la pata lastimada de Pipo
- El botón correcto (VENDA) brilla más fuerte

#### 5. ÉXITO: Momento mágico
**Problema:** La venda vuela a Pipo pero falta "wow".
**Solución:**
- Venda brilla mientras vuela (trail de partículas)
- Al llegar: flash blanco + sonido mágico
- Pipo se transforma: lying_down → sitting_happy CON transición tween
- Corazones flotan desde Pipo
- Paula salta y celebra
- Confeti burst desde arriba
- Pantalla tembla levemente (screenshake)

#### 6. PETTING REWARD: Recompensa final táctil
**Problema:** No hay recompensa táctil después de curar.
**Solución:**
- Después de curar, Pipo se queda sentado feliz
- Al tocar a Pipo: ladrido feliz + corazones + cola se mueve
- Timer de 5 segundos: si no toca, Paula dice "¿Quieres acariciar a Pipo?"
- Después de 3 caricias: nivel completo

#### 7. TIMER: El nivel dura máximo 90 segundos
**Problema:** Si el niño no hace nada, el nivel se queda colgado.
**Solución:**
- 30s sin interactuar: Paula señala la pata
- 45s sin interactuar: Paula dice "Toca VENDA"
- 60s sin interactuar: VENDA brilla y se mueve sola
- 90s: auto-completar con 1 estrella

#### 8. TTS MEJORADO: Paula habla más
**Problema:** Paula solo habla al inicio y al final.
**Solución:**
- Al entrar: "¡Hola! Este es Pipo, se lastimó la pata"
- Al ver pata: "Ay, la pata de Pipo está roja"
- Al elegir mal: "Un hueso es para comer, no para curar"
- Al curar: "¡Pipo puede caminar otra vez! ¡Eres un gran veterinario!"
- Al acariciar: "Pipo está muy feliz contigo"

---

### Métricas de éxito
- [ ] Pipo visualmente proporcional a Paula (mínimo 80% del tamaño)
- [ ] Cada toque produce sonido + partícula visual
- [ ] Error produce reacción divertida (no frustrante)
- [ ] Éxito produce 3+ efectos visuales simultáneos
- [ ] Nivel completo en < 90 segundos
- [ ] Petting reward implementado
- [ ] Timer de ayuda progresiva

---

### Orden de implementación
1. Rediseñar sprite DOG_LYING (más grande, más detalle)
2. Rediseñar sprite DOG_SITTING_HAPPY (más grande)
3. Implementar idle animations (respiración, parpadeo)
4. Mejorar onTreatmentFail (no-fail divertido)
5. Mejorar onTreatmentSuccess (momento mágico)
6. Implementar petting reward
7. Implementar timer de ayuda progresiva
8. Añadir más TTS de Paula
9. Test completo + screenshots
