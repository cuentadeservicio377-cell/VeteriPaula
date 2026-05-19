/**
 * Vocabulary organized by biome and difficulty
 */

export const vocabulary = {
  home: {
    name: 'Casa y Barrio',
    color: '#FF9AA2',
    bgColor: '#FFF0F0',
    words: [
      'casa', 'calle', 'jardin', 'puerta', 'ventana',
      'pata', 'cola', 'oreja', 'ojo', 'nariz',
      'herida', 'venda', 'medicina', 'agua', 'comida',
      'perro', 'gato', 'conejo', 'hamster', 'pajaro',
      'tortuga', 'pez', 'raton', 'loro'
    ],
    syllables: [
      ['ca', 'sa'], ['ca', 'lle'], ['jar', 'din'], ['puer', 'ta'],
      ['pa', 'ta'], ['co', 'la'], ['o', 're', 'ja'], ['o', 'jo'],
      ['he', 'ri', 'da'], ['ven', 'da'], ['me', 'di', 'ci', 'na'],
      ['a', 'gua'], ['co', 'mi', 'da'], ['per', 'ro'], ['ga', 'to'],
      ['co', 'ne', 'jo'], ['ham', 'ster'], ['pa', 'ja', 'ro']
    ]
  },
  farm: {
    name: 'Granja',
    color: '#B5EAD7',
    bgColor: '#F0FFF8',
    words: [
      'granja', 'establo', 'corral', 'leche', 'huevo',
      'lana', 'cascos', 'plumas', 'alimento', 'cepillo',
      'vaca', 'gallina', 'caballo', 'cerdo', 'oveja',
      'pato', 'burro', 'toro', 'gallo', 'pavo'
    ],
    syllables: [
      ['gran', 'ja'], ['es', 'ta', 'blo'], ['co', 'rral'],
      ['le', 'che'], ['hue', 'vo'], ['la', 'na'],
      ['ca', 'sos'], ['plu', 'mas'], ['a', 'li', 'men', 'to'],
      ['ce', 'pi', 'llo'], ['va', 'ca'], ['ga', 'lli', 'na'],
      ['ca', 'ba', 'llo'], ['cer', 'do'], ['o', 've', 'ja']
    ]
  },
  forest: {
    name: 'Bosque',
    color: '#C7CEEA',
    bgColor: '#F0F0FF',
    words: [
      'bosque', 'arbol', 'madriguera', 'nido', 'fruta',
      'nuez', 'rio', 'hoja', 'flor', 'seta',
      'zorro', 'ciervo', 'ardilla', 'erizo', 'buho',
      'conejo', 'ciervo', 'oso', 'lobo', 'cierva'
    ],
    syllables: [
      ['bos', 'que'], ['ar', 'bol'], ['ma', 'dri', 'gue', 'ra'],
      ['ni', 'do'], ['fru', 'ta'], ['nuez'], ['ri', 'o'],
      ['ho', 'ja'], ['flor'], ['se', 'ta'], ['zo', 'rro'],
      ['cier', 'vo'], ['ar', 'di', 'lla'], ['e', 'ri', 'zo'],
      ['bu', 'ho']
    ]
  },
  jungle: {
    name: 'Selva',
    color: '#FFDac1',
    bgColor: '#FFF5F0',
    words: [
      'selva', 'rio', 'fruta', 'platano', 'mango',
      'coco', 'hoja', 'liana', 'cueva', 'arena',
      'mono', 'tucan', 'jaguar', 'tortuga', 'delfin',
      'loro', 'iguana', 'tigre', 'serpiente', 'mariposa'
    ],
    syllables: [
      ['sel', 'va'], ['ri', 'o'], ['fru', 'ta'],
      ['pla', 'ta', 'no'], ['man', 'go'], ['co', 'co'],
      ['ho', 'ja'], ['lia', 'na'], ['cue', 'va'],
      ['a', 're', 'na'], ['mo', 'no'], ['tu', 'can'],
      ['ja', 'guar'], ['tor', 'tu', 'ga'], ['del', 'fin'],
      ['lo', 'ro'], ['i', 'gua', 'na'], ['ti', 'gre']
    ]
  }
};

export function getWordsForBiome(biomeKey, count = 5) {
  const biome = vocabulary[biomeKey];
  if (!biome) return [];
  const shuffled = [...biome.words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getSyllablesForWord(word) {
  for (const biomeKey of Object.keys(vocabulary)) {
    const biome = vocabulary[biomeKey];
    const match = biome.syllables.find(syl => syl.join('') === word.toLowerCase());
    if (match) return match;
  }
  // Fallback: try to split by vowels
  return splitIntoSyllables(word);
}

function splitIntoSyllables(word) {
  const vowels = 'aeiouáéíóú';
  const result = [];
  let current = '';
  for (const char of word.toLowerCase()) {
    current += char;
    if (vowels.includes(char)) {
      result.push(current);
      current = '';
    }
  }
  if (current) {
    if (result.length > 0) {
      result[result.length - 1] += current;
    } else {
      result.push(current);
    }
  }
  return result.length > 0 ? result : [word];
}
