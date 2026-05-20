import { useEffect, useState, useCallback, useMemo } from 'react';
import { vocabulary } from '../../data/vocabulary.js';
import { shuffle } from '../../utils/shuffle.js';
import { useTTS } from '../../hooks/useTTS.js';
import { getAnimalSpriteUrl } from '../../hooks/usePixelArt.js';
import { spriteToDataURL } from '../../utils/spriteToImage.js';
import { ITEM_DEFS } from '../../game-engine/sprites/Items.js';
import { ICON_SPRITES } from '../../game-engine/sprites/UI.js';

const MINIGAME_TYPES = ['flashcard', 'word_reveal', 'matching'];

const PIXEL_STYLE = { imageRendering: 'pixelated', display: 'block' };

/**
 * Loading screen with interactive vocabulary minigames
 * All visuals use pixel art sprites instead of emojis
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

  // Pre-generate sprite URLs (client-side only)
  const [spriteUrls, setSpriteUrls] = useState({});
  useEffect(() => {
    const urls = {};
    const animals = ['perro', 'gato', 'conejo', 'pajaro', 'tortuga', 'vaca', 'gallina', 'caballo', 'oveja', 'pato', 'zorro', 'ardilla', 'erizo', 'buho', 'ciervo', 'mono', 'tucan', 'jaguar', 'delfin'];
    animals.forEach(a => {
      urls[a] = getAnimalSpriteUrl(a, 4);
    });
    Object.keys(ITEM_DEFS).forEach(key => {
      urls[key] = spriteToDataURL(ITEM_DEFS[key], 4);
    });
    urls.book = spriteToDataURL(ICON_SPRITES.book, 4);
    urls.eye = spriteToDataURL(ICON_SPRITES.eye, 4);
    urls.arrowLeft = spriteToDataURL(ICON_SPRITES.arrowLeft, 4);
    urls.arrowRight = spriteToDataURL(ICON_SPRITES.arrowRight, 4);
    urls.check = spriteToDataURL(ICON_SPRITES.check, 4);
    urls.star = spriteToDataURL(ICON_SPRITES.star, 4);
    setSpriteUrls(urls);
  }, []);

  // Get sprite for a word
  const getWordSprite = (word) => {
    const key = word.toLowerCase();
    if (spriteUrls[key]) return spriteUrls[key];
    // Try common mappings
    const mappings = {
      platano: 'sol', mango: 'sol', coco: 'sol', fruta: 'sol',
      comida: 'sol', alimento: 'sol', medicina: 'medicina',
      agua: 'agua', venda: 'venda', herida: 'venda',
      cepillo: 'cepillo', bosque: 'sol', selva: 'sol',
      granja: 'sol', casa: 'home', calle: 'home',
      jardin: 'sol', arbol: 'sol', flor: 'star',
      hoja: 'sol', seta: 'sol', rio: 'agua',
      arena: 'sol', liana: 'sol', cueva: 'sol',
      leche: 'agua', huevo: 'star', lana: 'toalla',
      cascos: 'pinzas', plumas: 'toalla', nido: 'home',
      madriguera: 'home', nuez: 'sol', pata: 'venda',
      cola: 'toalla', oreja: 'sol', ojo: 'eye',
      nariz: 'sol', hamster: 'conejo', pez: 'delfin',
      loro: 'tucan', raton: 'conejo', cerdo: 'vaca',
      burro: 'caballo', toro: 'vaca', gallo: 'gallina',
      pavo: 'gallina', oso: 'zorro', lobo: 'zorro',
      iguana: 'tortuga', tigre: 'jaguar', serpiente: 'tortuga',
      mariposa: 'pajaro',
    };
    const mapped = mappings[key];
    if (mapped && spriteUrls[mapped]) return spriteUrls[mapped];
    return spriteUrls.book; // fallback
  };

  useEffect(() => {
    const biomeWords = vocabulary[nextBiome]?.words || vocabulary.home.words;
    const selected = shuffle(biomeWords).slice(0, 5);
    setWords(selected);
  }, [nextBiome]);

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
  const currentSprite = currentWord ? getWordSprite(currentWord) : null;

  return (
    <div className="screen-container" style={{
      background: 'linear-gradient(180deg, #FFF8F0 0%, #E8F5E9 100%)'
    }}>
      <h2 style={{
        fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
        color: '#5D4037',
        marginBottom: '10px'
      }}>
        Aprendiendo palabras
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
                  cursor: 'pointer',
                  marginBottom: '20px',
                  transition: 'transform 0.3s ease',
                  transform: revealed ? 'rotateY(180deg)' : 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '80px',
                }}
              >
                {revealed && currentSprite ? (
                  <img src={currentSprite} alt={currentWord} style={{ ...PIXEL_STYLE, width: '64px', height: '56px' }} />
                ) : (
                  spriteUrls.book && (
                    <img src={spriteUrls.book} alt="Libro" style={{ ...PIXEL_STYLE, width: '48px', height: '48px' }} />
                  )
                )}
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
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                    }}
                  >
                    {spriteUrls.star && (
                      <img src={spriteUrls.star} alt="Escuchar" style={{ ...PIXEL_STYLE, width: '28px', height: '28px' }} />
                    )}
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
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'center',
              }}>
                {currentSprite && (
                  <img src={currentSprite} alt={currentWord} style={{ ...PIXEL_STYLE, width: '64px', height: '56px' }} />
                )}
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
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                }}
              >
                {revealed && spriteUrls.check && (
                  <img src={spriteUrls.check} alt="" style={{ ...PIXEL_STYLE, width: '20px', height: '20px' }} />
                )}
                {!revealed && spriteUrls.eye && (
                  <img src={spriteUrls.eye} alt="" style={{ ...PIXEL_STYLE, width: '20px', height: '20px' }} />
                )}
                {revealed ? '¡Aprendida!' : 'Revelar'}
              </button>
            </>
          )}

          {/* Matching minigame */}
          {minigameType === 'matching' && (
            <>
              <div style={{
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'center',
              }}>
                {currentSprite && (
                  <img src={currentSprite} alt={currentWord} style={{ ...PIXEL_STYLE, width: '64px', height: '56px' }} />
                )}
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
                opacity: currentIndex === 0 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {spriteUrls.arrowLeft && (
                <img src={spriteUrls.arrowLeft} alt="" style={{ ...PIXEL_STYLE, width: '16px', height: '16px' }} />
              )}
              Anterior
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
                opacity: currentIndex === words.length - 1 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Siguiente
              {spriteUrls.arrowRight && (
                <img src={spriteUrls.arrowRight} alt="" style={{ ...PIXEL_STYLE, width: '16px', height: '16px' }} />
              )}
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
        Saltar vocabulario
      </button>
    </div>
  );
}
