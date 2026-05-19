import { useEffect } from 'react';
import { characters, getCelebrationMessage } from '../../data/characters.js';
import { useTTS } from '../../hooks/useTTS.js';

export default function CelebrationScreen({ levelData, onNext, onHome }) {
  const { speak } = useTTS();
  const characterKey = levelData.character || 'mama';
  const character = characters[characterKey];
  const message = getCelebrationMessage(characterKey, levelData.animal, levelData.treatment);

  useEffect(() => {
    // Read celebration message aloud
    const timer = setTimeout(() => {
      speak(message);
    }, 500);
    return () => clearTimeout(timer);
  }, [speak, message]);

  return (
    <div className="screen-container" style={{
      background: `linear-gradient(180deg, ${character?.color || '#FFF8F0'}30 0%, #FFF8F0 100%)`
    }}>
      {/* Stars */}
      <div style={{
        position: 'absolute',
        top: '10%',
        fontSize: '2rem',
        animation: 'bounce 1s ease infinite'
      }}>✨</div>
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '15%',
        fontSize: '1.5rem',
        animation: 'bounce 1.2s ease infinite 0.3s'
      }}>⭐</div>
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        fontSize: '1.8rem',
        animation: 'bounce 0.9s ease infinite 0.6s'
      }}>🌟</div>

      {/* Character */}
      <div style={{
        fontSize: 'clamp(5rem, 15vw, 8rem)',
        marginBottom: '10px',
        animation: 'scaleIn 0.5s ease'
      }}>
        {character?.emoji || '👨‍👩‍👧'}
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
        animation: 'scaleIn 0.6s ease 0.2s both'
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
          fontSize: '1.5rem',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        🔊
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
            boxShadow: '0 4px 15px rgba(181,234,215,0.4)'
          }}
        >
          ➡️ Siguiente Nivel
        </button>
        <button
          className="touch-button"
          onClick={onHome}
          style={{
            background: '#FFDac1',
            color: '#5D4037',
            fontSize: '1.2rem'
          }}
        >
          🏠 Inicio
        </button>
      </div>
    </div>
  );
}
