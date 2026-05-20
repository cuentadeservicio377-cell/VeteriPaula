import { useEffect } from 'react';
import { characters, getCelebrationMessage } from '../../data/characters.js';
import { useTTS } from '../../hooks/useTTS.js';
import { useFamilySprite, useIconSprite } from '../../hooks/usePixelArt.js';

export default function CelebrationScreen({ levelData, stars, onNext, onHome }) {
  const { speak } = useTTS();
  const characterKey = levelData.character || 'mama';
  const character = characters[characterKey];
  const message = getCelebrationMessage(characterKey, levelData.animal, levelData.treatment);

  const familySpriteUrl = useFamilySprite(characterKey, 6);
  const starUrl = useIconSprite('star', 4);
  const arrowUrl = useIconSprite('arrowRight', 4);
  const homeUrl = useIconSprite('arrowLeft', 4);
  const soundUrl = useIconSprite('book', 4);

  useEffect(() => {
    const timer = setTimeout(() => {
      speak(message);
    }, 500);
    return () => clearTimeout(timer);
  }, [speak, message]);

  const starStyle = {
    width: '36px',
    height: '36px',
    imageRendering: 'pixelated',
  };

  return (
    <div className="screen-container" style={{
      background: `linear-gradient(180deg, ${character?.color || '#FFF8F0'}30 0%, #FFF8F0 100%)`
    }}>
      {/* Floating stars background */}
      {starUrl && (
        <>
          <img src={starUrl} alt="" style={{ position: 'absolute', top: '10%', left: '20%', width: '32px', height: '32px', animation: 'bounce 1s ease infinite', imageRendering: 'pixelated' }} />
          <img src={starUrl} alt="" style={{ position: 'absolute', top: '15%', right: '15%', width: '32px', height: '32px', animation: 'bounce 1s ease infinite 0.3s', imageRendering: 'pixelated' }} />
          <img src={starUrl} alt="" style={{ position: 'absolute', top: '20%', left: '10%', width: '32px', height: '32px', animation: 'bounce 1s ease infinite 0.6s', imageRendering: 'pixelated' }} />
        </>
      )}

      {/* Star rating */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '15px',
        animation: 'scaleIn 0.4s ease',
      }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            ...starStyle,
            opacity: i <= stars ? 1 : 0.25,
            transform: i <= stars ? 'scale(1.1)' : 'scale(0.9)',
            transition: 'all 0.3s ease',
            filter: i <= stars ? 'drop-shadow(0 2px 8px rgba(255,215,0,0.5))' : 'none',
          }}>
            {starUrl && (
              <img src={starUrl} alt="" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }} />
            )}
          </div>
        ))}
      </div>

      <p style={{
        fontSize: '1rem',
        color: '#8D6E63',
        fontWeight: 700,
        margin: '0 0 10px 0',
        animation: 'fadeIn 0.5s ease 0.2s both',
      }}>
        {stars === 3 ? '¡Perfecto! Sin errores' : stars === 2 ? '¡Muy bien!' : '¡Lo lograste!'}
      </p>

      {/* Family character pixel art */}
      <div style={{
        marginBottom: '10px',
        animation: 'scaleIn 0.5s ease 0.3s both',
      }}>
        {familySpriteUrl ? (
          <img
            src={familySpriteUrl}
            alt={character?.name || 'Familia'}
            style={{
              width: '84px',
              height: '96px',
              imageRendering: 'pixelated',
            }}
          />
        ) : (
          <div style={{ width: '84px', height: '96px' }} />
        )}
      </div>

      <h2 style={{
        fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
        color: character?.color || '#5D4037',
        margin: '0 0 10px 0'
      }}>
        {character?.name || 'Familia'} dice:
      </h2>

      {/* Message bubble */}
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '24px 32px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        position: 'relative',
        animation: 'scaleIn 0.6s ease 0.4s both'
      }}>
        <div style={{
          position: 'absolute',
          top: '-15px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderBottom: '15px solid #fff'
        }} />
        <p style={{
          fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
          color: '#5D4037',
          lineHeight: 1.6,
          margin: 0,
          textAlign: 'center'
        }}>
          {message}
        </p>
      </div>

      {/* Replay TTS button */}
      <button
        onClick={() => speak(message)}
        style={{
          background: 'none',
          border: '2px solid #C7CEEA',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {soundUrl && (
          <img src={soundUrl} alt="Reproducir" style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} />
        )}
      </button>

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          className="touch-button"
          onClick={onNext}
          style={{
            background: '#B5EAD7',
            color: '#2E7D32',
            boxShadow: '0 4px 15px rgba(181,234,215,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {arrowUrl && <img src={arrowUrl} alt="" style={{ width: '20px', height: '20px', imageRendering: 'pixelated' }} />}
          Siguiente Nivel
        </button>
        <button
          className="touch-button"
          onClick={onHome}
          style={{
            background: '#FFDac1',
            color: '#5D4037',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {homeUrl && <img src={homeUrl} alt="" style={{ width: '20px', height: '20px', imageRendering: 'pixelated', transform: 'rotate(-180deg)' }} />}
          Inicio
        </button>
      </div>
    </div>
  );
}
