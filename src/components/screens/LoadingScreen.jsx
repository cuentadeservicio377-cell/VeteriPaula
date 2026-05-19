import { useEffect, useState, useCallback } from 'react';
import { vocabulary } from '../../data/vocabulary.js';
import { shuffle } from '../../utils/shuffle.js';
import { useTTS } from '../../hooks/useTTS.js';

const MINIGAME_TYPES = ['flashcard', 'word_reveal', 'matching'];

/**
 * Loading screen with interactive vocabulary minigames
 */
export default function LoadingScreen({ nextBiome, onReady }) {
  const [minigameType] = useState(() => 
    MINIGAME_TYPES[Math.floor(Math.random() * MINIGAME_TYPES.length)]
  );
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [matched, setMatched] = useState([]);
  const [progress, setProgress] = useState(0);
  const { speak } = useTTS();

  // Get vocabulary words for the next biome
  useEffect(() => {
    const biomeWords = vocabulary[nextBiome]?.words || vocabulary.home.words;
    const selected = shuffle(biomeWords).slice(0, 5);
    setWords(selected);
  }, [nextBiome]);

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => onReady(), 500);
          return 100;
        }
        return p + 2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onReady]);

  const speakWord = useCallback((word) => {
    speak(word);
  }, [speak]);

  const handleNextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(i => i + 1);
      setRevealed(false);
    }
  };

  const handlePrevWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setRevealed(false);
    }
  };

  const currentWord = words[currentIndex];

  // Get emoji for a word (simple mapping)
  const getWordEmoji = (word) => {
    const emojiMap = {
      perro: '🐕', gato: '🐈', conejo: '🐇', hamster: '🐹', pajaro: '🐦',
      tortuga: '🐢', pez: '🐟', loro: '🦜', raton: '🐁',
      vaca: '🐄', gallina: '🐔', caballo: '🐴', cerdo: '🐷',
      oveja: '🐑', pato: '🦆', burro: '🫏', toro: '🐂',
      gallo: '🐓', pavo: '🦃',
      zorro: '🦊', ardilla: '🐿️', erizo: '🦔', buho: '🦉',
      ciervo: '🦌', oso: '🐻', lobo: '🐺',
      mono: '🐵', tucan: '🐦', jaguar: '🐆', delfin: '🐬',
      iguana: '🦎', tigre: '🐯', serpiente: '🐍', mariposa: '🦋',
      casa: '🏠', calle: '🛣️', jardin: '🌻', pata: '🦶',
      cola: '🦚', oreja: '👂', ojo: '👁️', nariz: '👃',
      herida: '🩹', venda: '🤕', medicina: '💊', agua: '💧',
      comida: '🍎', granja: '🚜', establo: '🏚️', corral: '🌾',
      leche: '🥛', huevo: '🥚', lana: '🧶', cascos: '🥾',
      plumas: '🪶', alimento: '🌽', cepillo: '🪥', bosque: '🌲',
      arbol: '🌳', madriguera: '🕳️', nido: '🪹', fruta: '🍓',
      nuez: '🌰', rio: '🏞️', hoja: '🍃', flor: '🌸',
      seta: '🍄', selva: '🌴', platano: '🍌', mango: '🥭',
      coco: '🥥', liana: '🌿', cueva: '🪨', arena: '🏖️'
    };
    return emojiMap[word] || '📖';
  };

  return (
    <div className="screen-container" style={{
      background: 'linear-gradient(180deg, #FFF8F0 0%, #E8F5E9 100%)'
    }}>
      <h2 style={{
        fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
        color: '#5D4037',
        marginBottom: '10px'
      }}>
        📚 Aprendiendo palabras
      </h2>

      <p style={{
        fontSize: '1rem',
        color: '#8D6E63',
        marginBottom: '20px'
      }}>
        Mientras cargamos el siguiente nivel...
      </p>

      {/* Progress bar */}
      <div style={{
        width: '80%',
        maxWidth: '400px',
        height: '20px',
        background: '#E0E0E0',
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '30px'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: '#B5EAD7',
          borderRadius: '10px',
          transition: 'width 0.1s ease'
        }} />
      </div>

      {/* Minigame content */}
      {words.length > 0 && currentWord && (
        <div style={{
          background: '#fff',
          borderRadius: '24px',
          padding: '30px',
          maxWidth: '450px',
          width: '90%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          {/* Word counter */}
          <div style={{
            fontSize: '0.9rem',
            color: '#888',
            marginBottom: '15px'
          }}>
            Palabra {currentIndex + 1} de {words.length}
          </div>

          {/* Flashcard minigame */}
          {minigameType === 'flashcard' && (
            <>
              <div
                onClick={() => {
                  setRevealed(!revealed);
                  speakWord(currentWord);
                }}
                style={{
                  fontSize: 'clamp(4rem, 12vw, 6rem)',
                  cursor: 'pointer',
                  marginBottom: '20px',
                  transition: 'transform 0.3s ease',
                  transform: revealed ? 'rotateY(180deg)' : 'none'
                }}
              >
                {revealed ? getWordEmoji(currentWord) : '📖'}
              </div>

              {revealed && (
                <div className="animate-fade-in">
                  <div style={{
                    fontSize: 'clamp(2rem, 6vw, 3rem)',
                    fontWeight: 800,
                    color: '#5D4037',
                    marginBottom: '10px'
                  }}>
                    {currentWord.toUpperCase()}
                  </div>
                  <button
                    onClick={() => speakWord(currentWord)}
                    style={{
                      background: '#C7CEEA',
                      border: 'none',
                      borderRadius: '50%',
                      width: '50px',
                      height: '50px',
                      fontSize: '1.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    🔊
                  </button>
                </div>
              )}

              {!revealed && (
                <p style={{ color: '#888', fontSize: '1rem' }}>
                  Toca para ver la palabra
                </p>
              )}
            </>
          )}

          {/* Word reveal minigame */}
          {minigameType === 'word_reveal' && (
            <>
              <div style={{
                fontSize: 'clamp(3rem, 10vw, 5rem)',
                marginBottom: '15px'
              }}>
                {getWordEmoji(currentWord)}
              </div>

              <div style={{
                fontSize: 'clamp(2rem, 6vw, 3rem)',
                fontWeight: 800,
                color: '#5D4037',
                letterSpacing: revealed ? '0.1em' : '0.3em',
                marginBottom: '15px',
                transition: 'letter-spacing 0.5s ease'
              }}>
                {revealed ? currentWord.toUpperCase() : '•'.repeat(currentWord.length)}
              </div>

              <button
                className="touch-button"
                onClick={() => {
                  setRevealed(true);
                  speakWord(currentWord);
                }}
                style={{
                  background: revealed ? '#B5EAD7' : '#FFDac1',
                  color: '#5D4037',
                  fontSize: '1.2rem'
                }}
              >
                {revealed ? '✅ ¡Aprendida!' : '👁️ Revelar'}
              </button>
            </>
          )}

          {/* Matching minigame */}
          {minigameType === 'matching' && (
            <>
              <div style={{
                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                marginBottom: '15px'
              }}>
                {getWordEmoji(currentWord)}
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center'
              }}>
                {shuffle([
                  currentWord,
                  ...shuffle(words.filter(w => w !== currentWord)).slice(0, 2)
                ]).map((word, i) => (
                  <button
                    key={i}
                    className="touch-button"
                    onClick={() => {
                      if (word === currentWord) {
                        setRevealed(true);
                        speakWord(word);
                      }
                    }}
                    style={{
                      background: revealed && word === currentWord 
                        ? '#B5EAD7' 
                        : revealed && word !== currentWord
                          ? '#E0E0E0'
                          : '#FFDac1',
                      color: '#5D4037',
                      fontSize: '1.2rem',
                      minHeight: '50px',
                      opacity: revealed && word !== currentWord ? 0.5 : 1
                    }}
                  >
                    {word.toUpperCase()}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '25px',
            gap: '10px'
          }}>
            <button
              onClick={handlePrevWord}
              disabled={currentIndex === 0}
              style={{
                background: currentIndex === 0 ? '#E0E0E0' : '#C7CEEA',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                fontSize: '1rem',
                cursor: currentIndex === 0 ? 'default' : 'pointer',
                opacity: currentIndex === 0 ? 0.5 : 1
              }}
            >
              ⬅️ Anterior
            </button>
            <button
              onClick={handleNextWord}
              disabled={currentIndex === words.length - 1}
              style={{
                background: currentIndex === words.length - 1 ? '#E0E0E0' : '#C7CEEA',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                fontSize: '1rem',
                cursor: currentIndex === words.length - 1 ? 'default' : 'pointer',
                opacity: currentIndex === words.length - 1 ? 0.5 : 1
              }}
            >
              Siguiente ➡️
            </button>
          </div>
        </div>
      )}

      {/* Skip button */}
      <button
        onClick={onReady}
        style={{
          marginTop: '20px',
          background: 'none',
          border: 'none',
          color: '#888',
          fontSize: '0.9rem',
          cursor: 'pointer',
          textDecoration: 'underline'
        }}
      >
        Saltar vocabulario →
      </button>
    </div>
  );
}
