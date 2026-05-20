/**
 * Family characters and their celebration messages
 */

export const characters = {
  mama: {
    name: 'Mamá',
    style: 'caring',
    color: '#FF9AA2',
    messages: [
      '¡Ay, qué bien, Paula! ¡Qué bueno que curaste al {animal} con {treatment}! Estoy muy orgullosa de ti.',
      '¡Mi veterinaria favorita! El {animal} debe estar muy feliz contigo, Paula.',
      '¡Qué cuidadosa eres, Paula! El {animal} tiene mucha suerte de que lo hayas encontrado.',
      '¡Increíble, Paula! Cada día eres una mejor veterinaria. El {animal} te lo agradece mucho.'
    ]
  },
  papa: {
    name: 'Papá',
    style: 'playful',
    color: '#A0E7E5',
    messages: [
      '¡Wooo, Paula! ¡Eres la mejor veterinaria del mundo! El {animal} está súper feliz.',
      '¡Ja! ¡Ningún {animal} herido se escapa de mis garras... digo, de TUS garras, veterinaria Paula!',
      '¡Alto nivel, doctora Paula! Ese {animal} va a contarle a todos que lo curó una veterinaria estrella.',
      '¡Qué habilidad, Paula! Si sigues así vas a tener una clínica con fila de animales.'
    ]
  },
  abuelo: {
    name: 'Abuelo',
    style: 'wise',
    color: '#C7CEEA',
    messages: [
      'Muy bien hecho, Paula. Cuidar a los animales es una de las cosas más nobles que puede hacer una persona.',
      'El {animal} está agradecido, Paula. En mi tiempo también había veterinarias muy valientes como tú.',
      'Sabia decisión, Paula. El {animal} necesitaba exactamente eso: {treatment}. Buen trabajo.',
      'Cada animal que curas te hace más sabia, Paula. Sigue así, pequeña veterinaria.'
    ]
  },
  abuela: {
    name: 'Abuela',
    style: 'sweet',
    color: '#FFB7B2',
    messages: [
      '¡Ay, mi niña hermosa! El {animal} debe sentirse tan mejor contigo. Eres un angelito.',
      '¡Qué emoción verte curar al {animal}, Paula! Tienes un corazón enorme.',
      'Mi niña veterinaria... el {animal} te va a recordar siempre con cariño. Muy bien hecho.',
      '¡Qué alegría me da verte ayudar al {animal}! Eres una niña muy especial, Paula.'
    ]
  },
  bubu: {
    name: 'Bubu',
    style: 'energetic',
    color: '#E2F0CB',
    messages: [
      '¡BOOM! ¡Paula la veterinaria en acción! Ese {animal} no sabía lo que le esperaba.',
      '¡Wujuuu! ¡La doctora Paula lo hizo de nuevo! El {animal} está bailando de felicidad.',
      '¡Esa es mi sobrina! Curando {animal}s por toda la ciudad. ¡Eres imparable!',
      '¡Alerta de veterinaria increíble! Paula acaba de salvar a un {animal}. ¡Noticia de última hora!'
    ]
  },
  bibi: {
    name: 'Bibi',
    style: 'creative',
    color: '#FFDac1',
    messages: [
      '¡Qué creativa eres, Paula! Curaste al {animal} de una forma que ni yo hubiera pensado.',
      '¿Sabías que el {animal} te va a dibujar un retrato? Porque eres su heroína favorita.',
      '¡Paula, descubriste el tratamiento perfecto! Eres como una científica veterinaria.',
      'El {animal} ahora quiere ser veterinario como tú, Paula. ¡Le inspiraste!'
    ]
  }
};

export function getCelebrationMessage(characterKey, animal, treatment) {
  const char = characters[characterKey];
  if (!char) return '¡Muy bien, Paula!';
  
  const messages = char.messages;
  const message = messages[Math.floor(Math.random() * messages.length)];
  
  return message
    .replace('{animal}', animal)
    .replace('{treatment}', treatment);
}

export function getCharacterForLevel(levelId) {
  const mapping = {
    1: 'mama', 3: 'papa', 5: 'abuelo', 7: 'abuela',
    9: 'bubu', 11: 'bibi',
    13: 'mama', 15: 'papa', 17: 'abuelo', 19: 'abuela',
    21: 'bubu', 23: 'bibi',
    26: 'mama', 28: 'papa', 30: 'abuelo', 32: 'abuela',
    34: 'bubu', 36: 'bibi',
    39: 'mama', 42: 'papa', 44: 'abuelo', 46: 'abuela',
    48: 'bubu', 50: 'bibi'
  };
  return mapping[levelId] || 'mama';
}
