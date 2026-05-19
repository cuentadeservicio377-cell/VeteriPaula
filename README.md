# 🐾 Veterin Paula

> Un juego educativo para niños donde aprendes a leer mientras curas animales heridos.

**🎮 Juega ahora:** https://cuentadeservicio377-cell.github.io/VeteriPaula/

---

## 🎯 Propósito

**Veterin Paula** es un juego por niveles diseñado para niños de ~6 años que están aprendiendo a leer. La protagonista, Paula, recorre su camino para convertirse en veterinaria, encontrando animales heridos en situaciones cotidianas y curándolos mediante desafíos de lectura progresivos.

---

## 🎮 Características

- **📚 50 niveles progresivos** — De palabras simples a oraciones completas
- **🌍 4 biomas** — Casa/Barrio → Granja → Bosque → Selva
- **🎨 24 animales diferentes** — Cada uno con animaciones de herido, curación y feliz
- **👩‍⚕️ Paula** — Tu personaje veterinaria con animaciones
- **🗣️ Lectura en voz alta** — Web Speech API lee cada palabra para ayudar
- **🎉 Celebraciones familiares** — Mamá, Papá, Abuelo, Abuela, Bubu y Bibi celebran cada logro
- **📖 Minijuegos de vocabulario** — Pantallas de carga interactivas que enseñan palabras nuevas
- **🔊 Efectos de sonido** — Feedback auditivo para aciertos y errores
- **💾 Progreso guardado** — LocalStorage recuerda dónde quedaste
- **📱 Responsive** — Funciona en iPad, tablet y desktop

---

## 🛠️ Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Framework UI | React 18 + Vite |
| Renderizado juego | HTML5 Canvas 2D API |
| Lenguaje | JavaScript (ES2022) |
| Audio | Web Audio API + Web Speech API (TTS) |
| Build | Vite |
| Deploy | GitHub Pages |

---

## 🚀 Cómo ejecutar localmente

```bash
# Clonar el repo
git clone https://github.com/cuentadeservicio377-cell/VeteriPaula.git
cd VeteriPaula

# Instalar dependencias
npm install

# Servir en desarrollo
npm run dev

# Construir para producción
npm run build
```

---

## 📂 Estructura del Proyecto

```
veteripaula/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes UI reutilizables
│   │   ├── screens/         # Pantallas: Home, Map, Loading, Celebration
│   │   └── game/            # GameCanvas (wrapper React del Canvas)
│   ├── game-engine/
│   │   ├── entities/        # Paula, Animal, WordButton, Entity
│   │   ├── mechanics/       # ChooseWord, BuildSyllables, FollowInstructions
│   │   ├── scenes/          # Escenas del juego
│   │   ├── GameLoop.js      # Loop principal de renderizado
│   │   └── GameScene.js     # Escena de un nivel
│   ├── data/
│   │   ├── levels.js        # Definición de los 50 niveles
│   │   ├── vocabulary.js    # Vocabulario por bioma
│   │   └── characters.js    # Mensajes de celebración
│   ├── hooks/
│   │   └── useTTS.js        # Hook de Text-to-Speech
│   ├── utils/
│   │   ├── storage.js       # localStorage para progreso
│   │   └── shuffle.js       # Fisher-Yates shuffle
│   └── App.jsx              # Router de pantallas
├── docs/
│   └── specs/               # Documentación de diseño
└── README.md
```

---

## 🎓 Curva de Aprendizaje

| Fase | Niveles | Mecánica |
|------|---------|----------|
| **1** | 1-12 | Elegir palabra correcta entre opciones |
| **2** | 13-25 | Formar palabras con sílabas sueltas |
| **3** | 26-38 | Seguir instrucciones paso a paso |
| **4** | 39-50+ | Combinación de mecánicas + oraciones |

---

## 🗺️ Biomas

| Bioma | Niveles | Animales |
|-------|---------|----------|
| 🏠 Casa y Barrio | 1-12 | Perro, gato, conejo, hamster, pájaro, tortuga... |
| 🌾 Granja | 13-25 | Vaca, gallina, caballo, cerdo, oveja, pato... |
| 🌲 Bosque | 26-38 | Zorro, ardilla, erizo, búho, ciervo, oso... |
| 🌴 Selva | 39-50+ | Mono, tucán, jaguar, tortuga marina, delfín... |

---

## 👨‍👩‍👧 Familiares

Cada nivel de celebración trae un mensaje especial de:
- **Mamá** — Cariñosa y orgullosa ❤️
- **Papá** — Animado y divertido 🎉
- **Abuelo** — Sabio y tranquilo 🌿
- **Abuela** — Dulce y emotiva 🤗
- **Bubu** (tío con barba) — Energético y chistoso 💪
- **Bibi** (tío sin barba) — Creativo y curioso 🎨

---

## 📜 Licencia

Este proyecto es de código abierto para que más familias puedan ayudar a sus hijos a aprender a leer.

---

*Hecho con ❤️ para Paula y todas las niñas y niños que están aprendiendo a leer.*
