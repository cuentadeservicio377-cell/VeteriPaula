# Memoria del Proyecto

> Este archivo es mantenido automáticamente por Kimi.
> No editar manualmente a menos que sepas lo que haces.

## Contexto Actual
- Proyecto iniciado: 2026-05-19
- Última sesión: 2026-05-19
- Nombre: Veterin Paula
- Audiencia: Paula, 6 años, aprendiendo a leer
- Niveles: 50+ progresivos
- Repositorio: https://github.com/cuentadeservicio377-cell/VeteriPaula (público)

## Decisiones Arquitectónicas
- **Plataforma**: Web responsive (iPad + desktop)
- **Stack**: React + HTML5 Canvas híbrido
  - React para UI, menús, pantallas de carga, diálogos, celebraciones
  - Canvas para gameplay interactivo, animaciones, mecánicas de lectura
- **Motor de juego**: JavaScript vanilla en Canvas (sin Phaser)
- **Testing**: Playwright para validación visual y funcional
- **Arte**: Ilustraciones tipo cuento infantil, colores cálidos/pastel
- **Sonido**: Música por bioma + SFX + TTS para lectura en voz alta

## Curva de Aprendizaje (Progresión de Lectura)
| Fase | Niveles | Mecánica |
|------|---------|----------|
| 1 | 1-12 | Elegir palabra correcta entre opciones |
| 2 | 13-25 | Formar palabras con sílabas sueltas |
| 3 | 26-38 | Seguir instrucciones de 2-3 pasos |
| 4 | 39-50+ | Combinación de mecánicas + oraciones completas |

## Biomas (4)
1. Casa y Barrio (niveles 1-12) — mascotas domésticas
2. Granja (niveles 13-25) — animales de granja
3. Bosque (niveles 26-38) — animales salvajes
4. Selva/Exóticos (niveles 39-50+) — animales exóticos

## Familiares en Celebraciones
- Mamá — niveles 1, 13, 26, 39
- Papá — niveles 3, 15, 28, 42
- Abuelo — niveles 5, 17, 30, 44
- Abuela — niveles 7, 19, 32, 46
- Bubu (tío con barba) — niveles 9, 21, 34, 48
- Bibi (tío sin barba) — niveles 11, 23, 36, 50

## APIs / Integraciones
- Web Speech API (TTS para lectura en voz alta)
- Canvas 2D API
- React 18+

## Gotchas Conocidos
- Safari en iPad puede tener limitaciones con Web Speech API
- Touch events deben ser grandes para dedos de niño de 6 años
- Audio en Safari requiere user interaction para autoplay
