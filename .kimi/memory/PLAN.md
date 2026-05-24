# Plan Maestro — VeteriPaula v2.x

> Flujo: project-flow + gbrain + game-dev skills
> Estado: Migración en curso

---

## Fase 0: Migración al Nuevo Flujo (ESTA SESIÓN)

### 0.1 Actualizar estructura de memoria
- [ ] Reescribir `.kimi/AGENTS.md` con reglas del nuevo flujo
- [ ] Crear skill personalizado `.kimi/skills/veteripaula-dev/SKILL.md`
- [ ] Integrar `develop-web-game` al skill (testing loop Playwright)
- [ ] Integrar `game-developer` al skill (state machines, pooling, patterns)

### 0.2 Configurar testing automatizado
- [ ] Adaptar `web_game_playwright_client.js` al proyecto
- [ ] Crear `tests/e2e/veteripaula-actions.json` para cada mecánica
- [ ] Agregar `window.render_game_to_text()` al game engine
- [ ] Agregar `window.advanceTime(ms)` al game loop

### 0.3 Sincronizar con gbrain
- [ ] Guardar memoria actual en gbrain (`veteripaula/memory`, `veteripaula/plan`)
- [ ] Verificar que MCP gbrain responde correctamente

---

## Fase 1: Sonidos y Audio (v2.1)

### 1.1 Sistema de fonética por letra
- [ ] Crear `src/audio/PhoneticEngine.js`
- [ ] Mapear /a/, /e/, /i/, /o/, /u/ a sonidos
- [ ] Integrar Web Audio API para síntesis
- [ ] Tests: reproducir fonemas, capturar screenshots de feedback visual

### 1.2 Música ambiental por bloque
- [ ] 4 pistas de fondo (xilófono, guitarra, flauta, bongos)
- [ ] Sistema de crossfade entre biomas
- [ ] Tests: verificar que la música cambia al entrar a cada bioma

---

## Fase 2: Arte y Animaciones (v2.2)

### 2.1 Sprites de Paula
- [ ] Diseñar 3 estados: idle, curando, celebrando
- [ ] Integrar sprites en Canvas
- [ ] Tests: verificar animaciones frame a frame

### 2.2 Sistema de estrellas 1-3
- [ ] Calcular score por: tiempo, intentos, ayudas usadas
- [ ] Animación de estrellas en pantalla de éxito
- [ ] Guardar mejor score en localStorage
- [ ] Tests: verificar que 3 estrellas solo se dan en condiciones perfectas

---

## Fase 3: Coleccionables y Progreso (v2.3)

### 3.1 Galería de animales curados
- [ ] Crear pantalla de galería
- [ ] Desbloquear animal al completar nivel
- [ ] Mostrar stats por animal
- [ ] Tests: verificar que los animales aparecen en galería

### 3.2 Dashboard para padres
- [ ] Pantalla secreta (gesto o código)
- [ ] Métricas: niveles completados, tiempo total, precisión
- [ ] Gráfico simple de progreso
- [ ] Tests: verificar que solo se accede con el gesto correcto

---

## Fase 4: Testing y Pulido (v2.4)

### 4.1 E2E con Playwright
- [ ] Test de cada nivel (3 mecánicas × 20 niveles)
- [ ] Test de flujo completo: inicio → nivel 1 → celebración → mapa
- [ ] Test de responsive (iPad, desktop)

### 4.2 Playtesting con niños
- [ ] Preparar build para iPad
- [ ] Observar 3-5 sesiones
- [ ] Documentar fricciones y ajustar dificultad

---

## Reglas de Integración de Skills

### develop-web-game (OpenAI)
Usar en CADA iteración de código:
1. Implementar cambio pequeño
2. Correr Playwright client con actions específicas
3. Revisar screenshots
4. Verificar `render_game_to_text()`
5. Si hay errores, arreglar antes de continuar

### game-developer (Jeffallan)
Usar como referencia de arquitectura:
- State Machine para estados del juego (menú, jugando, pausa, celebración)
- Object Pooling para partículas y efectos visuales
- Component caching en el game loop
- Delta time para animaciones frame-independent

---

## Checkpoints (Commits)

| Fase | Commit Message |
|------|----------------|
| 0 | `chore: migración a project-flow + skills de game-dev` |
| 1 | `feat: sistema de fonética y música ambiental` |
| 2 | `feat: sprites de Paula + sistema de estrellas` |
| 3 | `feat: galería de animales + dashboard padres` |
| 4 | `test: suite E2E completa + ajustes post-playtest` |
