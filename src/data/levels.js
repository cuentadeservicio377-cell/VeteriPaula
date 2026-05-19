/**
 * All 50+ level definitions for Veterin Paula
 */

export const levels = [
  // ========== BIOMA 1: CASA Y BARRIO (Niveles 1-12) ==========
  // Mecánica: choose_word
  {
    id: 1, biome: 'home', animal: 'perro', injury: 'pata',
    mechanic: 'choose_word',
    question: 'El perrito tiene la pata lastimada. ¿Qué necesita?',
    options: ['VENDA', 'HUESO', 'AGUA'],
    correct: 'VENDA',
    vocabulary: ['pata', 'venda', 'herida'],
    treatment: 'una venda en la pata'
  },
  {
    id: 2, biome: 'home', animal: 'gato', injury: 'oreja',
    mechanic: 'choose_word',
    question: 'El gatito tiene la oreja sucia. ¿Qué necesita?',
    options: ['AGUA', 'COMIDA', 'CEPILLO'],
    correct: 'AGUA',
    vocabulary: ['oreja', 'agua', 'sucia'],
    treatment: 'agua limpia'
  },
  {
    id: 3, biome: 'home', animal: 'conejo', injury: 'ojo',
    mechanic: 'choose_word',
    question: 'El conejito tiene el ojo irritado. ¿Qué necesita?',
    options: ['MEDICINA', 'ZANAHORIA', 'JUGUETE'],
    correct: 'MEDICINA',
    vocabulary: ['ojo', 'medicina', 'irritado'],
    treatment: 'medicina para el ojo'
  },
  {
    id: 4, biome: 'home', animal: 'hamster', injury: 'pata',
    mechanic: 'choose_word',
    question: 'El hamster tiene la pata torcida. ¿Qué necesita?',
    options: ['REPOSO', 'RUEDA', 'SEMIllAS'],
    correct: 'REPOSO',
    vocabulary: ['pata', 'reposo', 'torcida'],
    treatment: 'reposo para la pata'
  },
  {
    id: 5, biome: 'home', animal: 'pajaro', injury: 'ala',
    mechanic: 'choose_word',
    question: 'El pajarito tiene el ala lastimada. ¿Qué necesita?',
    options: ['VENDA', 'SEMILLAS', 'JAULA'],
    correct: 'VENDA',
    vocabulary: ['ala', 'venda', 'lastimada'],
    treatment: 'una venda en el ala'
  },
  {
    id: 6, biome: 'home', animal: 'tortuga', injury: 'caparazon',
    mechanic: 'choose_word',
    question: 'La tortuguita tiene el caparazon sucio. ¿Qué necesita?',
    options: ['AGUA', 'LECHUGA', 'SOL'],
    correct: 'AGUA',
    vocabulary: ['caparazon', 'agua', 'sucio'],
    treatment: 'agua para limpiar el caparazon'
  },
  {
    id: 7, biome: 'home', animal: 'pez', injury: 'aleta',
    mechanic: 'choose_word',
    question: 'El pececito tiene la aleta dañada. ¿Qué necesita?',
    options: ['AGUA_LIMPIA', 'COMIDA', 'PIEDRAS'],
    correct: 'AGUA_LIMPIA',
    vocabulary: ['aleta', 'agua', 'danada'],
    treatment: 'agua limpia para la aleta'
  },
  {
    id: 8, biome: 'home', animal: 'perro', injury: 'cola',
    mechanic: 'choose_word',
    question: 'El perrito tiene la cola cortada. ¿Qué necesita?',
    options: ['VENDA', 'PELOTA', 'CASA'],
    correct: 'VENDA',
    vocabulary: ['cola', 'venda', 'cortada'],
    treatment: 'una venda en la cola'
  },
  {
    id: 9, biome: 'home', animal: 'gato', injury: 'bigotes',
    mechanic: 'choose_word',
    question: 'El gatito tiene los bigotes sucios. ¿Qué necesita?',
    options: ['AGUA', 'LECHE', 'RATON'],
    correct: 'AGUA',
    vocabulary: ['bigotes', 'agua', 'sucios'],
    treatment: 'agua para limpiar los bigotes'
  },
  {
    id: 10, biome: 'home', animal: 'loro', injury: 'pico',
    mechanic: 'choose_word',
    question: 'El lorito tiene el pico lastimado. ¿Qué necesita?',
    options: ['MEDICINA', 'SEMILLAS', 'ESPEJO'],
    correct: 'MEDICINA',
    vocabulary: ['pico', 'medicina', 'lastimado'],
    treatment: 'medicina para el pico'
  },
  {
    id: 11, biome: 'home', animal: 'raton', injury: 'pata',
    mechanic: 'choose_word',
    question: 'El ratoncito tiene la pata torcida. ¿Qué necesita?',
    options: ['REPOSO', 'QUESO', 'CUEVA'],
    correct: 'REPOSO',
    vocabulary: ['pata', 'reposo', 'torcida'],
    treatment: 'reposo para la pata'
  },
  {
    id: 12, biome: 'home', animal: 'conejo', injury: 'oreja',
    mechanic: 'choose_word',
    question: 'El conejito tiene la oreja lastimada. ¿Qué necesita?',
    options: ['VENDA', 'ZANAHORIA', 'HENO'],
    correct: 'VENDA',
    vocabulary: ['oreja', 'venda', 'lastimada'],
    treatment: 'una venda en la oreja'
  },

  // ========== BIOMA 2: GRANJA (Niveles 13-25) ==========
  // Mecánica: build_syllables
  {
    id: 13, biome: 'farm', animal: 'vaca', injury: 'cascos',
    mechanic: 'build_syllables',
    question: 'La vaquita tiene los cascos sucios. Forma la palabra del tratamiento:',
    syllables: ['CE', 'PI', 'LLO'],
    target: 'CEPILLO',
    vocabulary: ['cascos', 'cepillo', 'sucios'],
    treatment: 'un cepillo para los cascos'
  },
  {
    id: 14, biome: 'farm', animal: 'gallina', injury: 'plumas',
    mechanic: 'build_syllables',
    question: 'La gallinita tiene las plumas sucias. Forma la palabra:',
    syllables: ['A', 'GUA'],
    target: 'AGUA',
    vocabulary: ['plumas', 'agua', 'sucias'],
    treatment: 'agua para limpiar las plumas'
  },
  {
    id: 15, biome: 'farm', animal: 'caballo', injury: 'pata',
    mechanic: 'build_syllables',
    question: 'El caballito tiene la pata lastimada. Forma la palabra:',
    syllables: ['VEN', 'DA'],
    target: 'VENDA',
    vocabulary: ['pata', 'venda', 'lastimada'],
    treatment: 'una venda en la pata'
  },
  {
    id: 16, biome: 'farm', animal: 'cerdo', injury: 'piel',
    mechanic: 'build_syllables',
    question: 'El cerdito tiene la piel seca. Forma la palabra:',
    syllables: ['A', 'LI', 'MEN', 'TO'],
    target: 'ALIMENTO',
    vocabulary: ['piel', 'alimento', 'seca'],
    treatment: 'alimento nutritivo'
  },
  {
    id: 17, biome: 'farm', animal: 'oveja', injury: 'lana',
    mechanic: 'build_syllables',
    question: 'La ovejita tiene la lana enredada. Forma la palabra:',
    syllables: ['CE', 'PI', 'LLO'],
    target: 'CEPILLO',
    vocabulary: ['lana', 'cepillo', 'enredada'],
    treatment: 'un cepillo para la lana'
  },
  {
    id: 18, biome: 'farm', animal: 'pato', injury: 'pata',
    mechanic: 'build_syllables',
    question: 'El patito tiene la pata torcida. Forma la palabra:',
    syllables: ['RE', 'PO', 'SO'],
    target: 'REPOSO',
    vocabulary: ['pata', 'reposo', 'torcida'],
    treatment: 'reposo para la pata'
  },
  {
    id: 19, biome: 'farm', animal: 'burro', injury: 'oreja',
    mechanic: 'build_syllables',
    question: 'El burrito tiene la oreja lastimada. Forma la palabra:',
    syllables: ['ME', 'DI', 'CI', 'NA'],
    target: 'MEDICINA',
    vocabulary: ['oreja', 'medicina', 'lastimada'],
    treatment: 'medicina para la oreja'
  },
  {
    id: 20, biome: 'farm', animal: 'toro', injury: 'cuerno',
    mechanic: 'build_syllables',
    question: 'El torito tiene el cuerno raspado. Forma la palabra:',
    syllables: ['VEN', 'DA'],
    target: 'VENDA',
    vocabulary: ['cuerno', 'venda', 'raspado'],
    treatment: 'una venda en el cuerno'
  },
  {
    id: 21, biome: 'farm', animal: 'gallo', injury: 'pico',
    mechanic: 'build_syllables',
    question: 'El gallito tiene el pico lastimado. Forma la palabra:',
    syllables: ['A', 'GUA'],
    target: 'AGUA',
    vocabulary: ['pico', 'agua', 'lastimado'],
    treatment: 'agua para limpiar el pico'
  },
  {
    id: 22, biome: 'farm', animal: 'pavo', injury: 'cola',
    mechanic: 'build_syllables',
    question: 'El pavito tiene la cola sin plumas. Forma la palabra:',
    syllables: ['A', 'LI', 'MEN', 'TO'],
    target: 'ALIMENTO',
    vocabulary: ['cola', 'alimento', 'plumas'],
    treatment: 'alimento para crecer plumas'
  },
  {
    id: 23, biome: 'farm', animal: 'vaca', injury: 'leche',
    mechanic: 'build_syllables',
    question: 'La vaquita no tiene leche. Forma la palabra:',
    syllables: ['A', 'GUA'],
    target: 'AGUA',
    vocabulary: ['leche', 'agua', 'beber'],
    treatment: 'agua fresca para beber'
  },
  {
    id: 24, biome: 'farm', animal: 'caballo', injury: 'crin',
    mechanic: 'build_syllables',
    question: 'El caballito tiene la crin enredada. Forma la palabra:',
    syllables: ['CE', 'PI', 'LLO'],
    target: 'CEPILLO',
    vocabulary: ['crin', 'cepillo', 'enredada'],
    treatment: 'un cepillo para la crin'
  },
  {
    id: 25, biome: 'farm', animal: 'oveja', injury: 'pata',
    mechanic: 'build_syllables',
    question: 'La ovejita tiene la pata lastimada. Forma la palabra:',
    syllables: ['VEN', 'DA'],
    target: 'VENDA',
    vocabulary: ['pata', 'venda', 'lastimada'],
    treatment: 'una venda en la pata'
  },

  // ========== BIOMA 3: BOSQUE (Niveles 26-38) ==========
  // Mecánica: follow_instructions
  {
    id: 26, biome: 'forest', animal: 'zorro', injury: 'pata',
    mechanic: 'follow_instructions',
    question: 'El zorrito tiene una espina en la pata. Sigue los pasos:',
    steps: ['LAVA', 'SACA', 'VENDA'],
    stepLabels: ['Lava la herida', 'Saca la espina', 'Pon venda'],
    vocabulary: ['pata', 'espina', 'venda'],
    treatment: 'lavar, sacar la espina y poner venda'
  },
  {
    id: 27, biome: 'forest', animal: 'ardilla', injury: 'cola',
    mechanic: 'follow_instructions',
    question: 'La ardillita tiene la cola raspada. Sigue los pasos:',
    steps: ['LAVA', 'MEDICINA', 'REPOSO'],
    stepLabels: ['Lava la herida', 'Pon medicina', 'Dale reposo'],
    vocabulary: ['cola', 'medicina', 'reposo'],
    treatment: 'lavar, medicina y reposo'
  },
  {
    id: 28, biome: 'forest', animal: 'erizo', injury: 'espinas',
    mechanic: 'follow_instructions',
    question: 'El ericito tiene espinas rotas. Sigue los pasos:',
    steps: ['AGUA', 'COMIDA', 'ABRAZO'],
    stepLabels: ['Dale agua', 'Dale comida', 'Dale un abrazo suave'],
    vocabulary: ['espinas', 'agua', 'comida'],
    treatment: 'agua, comida y un abrazo'
  },
  {
    id: 29, biome: 'forest', animal: 'buho', injury: 'ala',
    mechanic: 'follow_instructions',
    question: 'El buho tiene el ala lastimada. Sigue los pasos:',
    steps: ['LAVA', 'VENDA', 'REPOSO'],
    stepLabels: ['Lava el ala', 'Pon venda', 'Dale reposo'],
    vocabulary: ['ala', 'venda', 'reposo'],
    treatment: 'lavar, venda y reposo'
  },
  {
    id: 30, biome: 'forest', animal: 'ciervo', injury: 'cuernos',
    mechanic: 'follow_instructions',
    question: 'El ciervito tiene los cuernos raspados. Sigue los pasos:',
    steps: ['LAVA', 'MEDICINA', 'AGUA'],
    stepLabels: ['Lava los cuernos', 'Pon medicina', 'Dale agua'],
    vocabulary: ['cuernos', 'medicina', 'agua'],
    treatment: 'lavar, medicina y agua'
  },
  {
    id: 31, biome: 'forest', animal: 'conejo', injury: 'oreja',
    mechanic: 'follow_instructions',
    question: 'El conejito tiene la oreja lastimada. Sigue los pasos:',
    steps: ['LAVA', 'VENDA', 'COMIDA'],
    stepLabels: ['Lava la oreja', 'Pon venda', 'Dale comida'],
    vocabulary: ['oreja', 'venda', 'comida'],
    treatment: 'lavar, venda y comida'
  },
  {
    id: 32, biome: 'forest', animal: 'oso', injury: 'pata',
    mechanic: 'follow_instructions',
    question: 'El osito tiene la pata hinchada. Sigue los pasos:',
    steps: ['HIELO', 'VENDA', 'REPOSO'],
    stepLabels: ['Pon hielo', 'Pon venda', 'Dale reposo'],
    vocabulary: ['pata', 'hielo', 'venda'],
    treatment: 'hielo, venda y reposo'
  },
  {
    id: 33, biome: 'forest', animal: 'lobo', injury: 'diente',
    mechanic: 'follow_instructions',
    question: 'El lobito tiene un diente flojo. Sigue los pasos:',
    steps: ['AGUA', 'COMIDA', 'REPOSO'],
    stepLabels: ['Dale agua', 'Dale comida blanda', 'Dale reposo'],
    vocabulary: ['diente', 'agua', 'comida'],
    treatment: 'agua, comida blanda y reposo'
  },
  {
    id: 34, biome: 'forest', animal: 'zorro', injury: 'cola',
    mechanic: 'follow_instructions',
    question: 'El zorrito tiene la cola sin pelos. Sigue los pasos:',
    steps: ['LAVA', 'MEDICINA', 'COMIDA'],
    stepLabels: ['Lava la cola', 'Pon medicina', 'Dale comida nutritiva'],
    vocabulary: ['cola', 'medicina', 'comida'],
    treatment: 'lavar, medicina y comida nutritiva'
  },
  {
    id: 35, biome: 'forest', animal: 'ardilla', injury: 'pata',
    mechanic: 'follow_instructions',
    question: 'La ardillita tiene la pata torcida. Sigue los pasos:',
    steps: ['HIELO', 'VENDA', 'REPOSO'],
    stepLabels: ['Pon hielo', 'Pon venda', 'Dale reposo'],
    vocabulary: ['pata', 'hielo', 'venda'],
    treatment: 'hielo, venda y reposo'
  },
  {
    id: 36, biome: 'forest', animal: 'erizo', injury: 'nariz',
    mechanic: 'follow_instructions',
    question: 'El ericito tiene la nariz fria. Sigue los pasos:',
    steps: ['ABRIGO', 'COMIDA', 'ABRAZO'],
    stepLabels: ['Pon abrigo', 'Dale comida', 'Dale un abrazo'],
    vocabulary: ['nariz', 'abrigo', 'comida'],
    treatment: 'abrigo, comida y un abrazo'
  },
  {
    id: 37, biome: 'forest', animal: 'buho', injury: 'ojo',
    mechanic: 'follow_instructions',
    question: 'El buho tiene el ojo cerrado. Sigue los pasos:',
    steps: ['LAVA', 'MEDICINA', 'REPOSO'],
    stepLabels: ['Lava el ojo', 'Pon medicina', 'Dale reposo oscuro'],
    vocabulary: ['ojo', 'medicina', 'reposo'],
    treatment: 'lavar, medicina y reposo oscuro'
  },
  {
    id: 38, biome: 'forest', animal: 'ciervo', injury: 'pata',
    mechanic: 'follow_instructions',
    question: 'El ciervito tiene la pata cortada. Sigue los pasos:',
    steps: ['LAVA', 'VENDA', 'MEDICINA'],
    stepLabels: ['Lava la herida', 'Pon venda', 'Pon medicina'],
    vocabulary: ['pata', 'venda', 'medicina'],
    treatment: 'lavar, venda y medicina'
  },

  // ========== BIOMA 4: SELVA (Niveles 39-50+) ==========
  // Mecánica: combined
  {
    id: 39, biome: 'jungle', animal: 'mono', injury: 'cabeza',
    mechanic: 'combined',
    subMechanic: 'follow_instructions',
    question: 'El monito se cayó de la liana. Lee la receta:',
    steps: ['HIELO', 'PLATANO', 'ABRAZO'],
    stepLabels: ['Pon hielo en la cabeza', 'Dale un platano', 'Dale un abrazo'],
    vocabulary: ['cabeza', 'platano', 'abrazo'],
    treatment: 'hielo, platano y un abrazo'
  },
  {
    id: 40, biome: 'jungle', animal: 'tucan', injury: 'pico',
    mechanic: 'combined',
    subMechanic: 'choose_word',
    question: 'El tucancito tiene el pico seco. ¿Qué necesita?',
    options: ['AGUA', 'FRUTA', 'HOJA'],
    correct: 'AGUA',
    vocabulary: ['pico', 'agua', 'seco'],
    treatment: 'agua fresca para el pico'
  },
  {
    id: 41, biome: 'jungle', animal: 'jaguar', injury: 'pata',
    mechanic: 'combined',
    subMechanic: 'build_syllables',
    question: 'El jaguarito tiene la pata hinchada. Forma la palabra:',
    syllables: ['VEN', 'DA'],
    target: 'VENDA',
    vocabulary: ['pata', 'venda', 'hinchada'],
    treatment: 'una venda en la pata'
  },
  {
    id: 42, biome: 'jungle', animal: 'tortuga', injury: 'caparazon',
    mechanic: 'combined',
    subMechanic: 'follow_instructions',
    question: 'La tortuguita marina tiene el caparazon sucio. Sigue los pasos:',
    steps: ['AGUA', 'CEPILLO', 'SOL'],
    stepLabels: ['Lava con agua', 'Cepilla suave', 'Dale sol'],
    vocabulary: ['caparazon', 'cepillo', 'sol'],
    treatment: 'agua, cepillo y sol'
  },
  {
    id: 43, biome: 'jungle', animal: 'delfin', injury: 'aleta',
    mechanic: 'combined',
    subMechanic: 'choose_word',
    question: 'El delfincito tiene la aleta cortada. ¿Qué necesita?',
    options: ['VENDA', 'AGUA', 'PECES'],
    correct: 'VENDA',
    vocabulary: ['aleta', 'venda', 'cortada'],
    treatment: 'una venda en la aleta'
  },
  {
    id: 44, biome: 'jungle', animal: 'loro', injury: 'plumas',
    mechanic: 'combined',
    subMechanic: 'build_syllables',
    question: 'El lorito tiene las plumas sucias. Forma la palabra:',
    syllables: ['A', 'GUA'],
    target: 'AGUA',
    vocabulary: ['plumas', 'agua', 'sucias'],
    treatment: 'agua para limpiar las plumas'
  },
  {
    id: 45, biome: 'jungle', animal: 'iguana', injury: 'cola',
    mechanic: 'combined',
    subMechanic: 'follow_instructions',
    question: 'La iguanita tiene la cola torcida. Sigue los pasos:',
    steps: ['HIELO', 'REPOSO', 'SOL'],
    stepLabels: ['Pon hielo', 'Dale reposo', 'Dale sol'],
    vocabulary: ['cola', 'hielo', 'reposo'],
    treatment: 'hielo, reposo y sol'
  },
  {
    id: 46, biome: 'jungle', animal: 'tigre', injury: 'pata',
    mechanic: 'combined',
    subMechanic: 'choose_word',
    question: 'El tigrecito tiene la pata lastimada. ¿Qué necesita?',
    options: ['VENDA', 'CARNE', 'AGUA'],
    correct: 'VENDA',
    vocabulary: ['pata', 'venda', 'lastimada'],
    treatment: 'una venda en la pata'
  },
  {
    id: 47, biome: 'jungle', animal: 'serpiente', injury: 'piel',
    mechanic: 'combined',
    subMechanic: 'build_syllables',
    question: 'La serpientita tiene la piel seca. Forma la palabra:',
    syllables: ['A', 'GUA'],
    target: 'AGUA',
    vocabulary: ['piel', 'agua', 'seca'],
    treatment: 'agua para hidratar la piel'
  },
  {
    id: 48, biome: 'jungle', animal: 'mariposa', injury: 'alas',
    mechanic: 'combined',
    subMechanic: 'follow_instructions',
    question: 'La mariposita tiene las alas mojadas. Sigue los pasos:',
    steps: ['SECAR', 'REPOSO', 'SOL'],
    stepLabels: ['Seca las alas', 'Dale reposo', 'Dale sol'],
    vocabulary: ['alas', 'reposo', 'sol'],
    treatment: 'secar, reposo y sol'
  },
  {
    id: 49, biome: 'jungle', animal: 'mono', injury: 'mano',
    mechanic: 'combined',
    subMechanic: 'build_syllables',
    question: 'El monito tiene la mano cortada. Forma la palabra:',
    syllables: ['VEN', 'DA'],
    target: 'VENDA',
    vocabulary: ['mano', 'venda', 'cortada'],
    treatment: 'una venda en la mano'
  },
  {
    id: 50, biome: 'jungle', animal: 'tucan', injury: 'pata',
    mechanic: 'combined',
    subMechanic: 'follow_instructions',
    question: 'El tucancito tiene la pata torcida. Sigue la receta final:',
    steps: ['HIELO', 'VENDA', 'FRUTA', 'ABRAZO'],
    stepLabels: ['Pon hielo', 'Pon venda', 'Dale fruta', 'Dale un abrazo'],
    vocabulary: ['pata', 'venda', 'fruta'],
    treatment: 'hielo, venda, fruta y un abrazo'
  }
];

export function getLevel(id) {
  return levels.find(l => l.id === id);
}

export function getLevelsByBiome(biome) {
  return levels.filter(l => l.biome === biome);
}

export function getTotalLevels() {
  return levels.length;
}
