import { useEffect, useState } from 'react';
import { getProgress } from '../../utils/storage.js';

export default function HomeScreen({ onPlay, onSelectLevel, onReset }) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  return (
    <div className="screen-container" style={{
      background: 'linear-gradient(180deg, #FFF8F0 0%, #FFE4E1 100%)'
    }}>
      {/* Animated title */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', marginBottom: '10px' }}>
          🐾
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: 800,
          color: '#5D4037',
          margin: 0,
          textShadow: '2px 2px 0px rgba(255,154,162,0.3)'
        }}>
          Veterin Paula
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.3rem)',
          color: '#8D6E63',
          marginTop: '10px'
        }}>
          Aprende a leer mientras curas animales ❤️
        </p>
      </div>

      {/* Paula avatar */}
      <div style={{
        fontSize: 'clamp(4rem, 12vw, 8rem)',
        marginBottom: '30px',
        animation: 'bounce 2s ease infinite'
      }}>
        👩‍⚕️
      </div>

      {/* Buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '320px'
      }}>
        <button
          className="touch-button"
          onClick={onPlay}
          style={{
            background: '#FF9AA2',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(255,154,162,0.4)'
          }}
        >
          ▶️ Jugar
        </button>

        {progress && progress.currentLevel > 1 && (
          <button
            className="touch-button"
            onClick={onSelectLevel}
            style={{
              background: '#C7CEEA',
              color: '#5D4037',
              fontSize: '1.2rem'
            }}
          >
            🗺️ Elegir Nivel
          </button>
        )}

        {progress && progress.currentLevel > 1 && (
          <button
            className="touch-button"
            onClick={() => {
              if (confirm('¿Quieres empezar de nuevo? Se borrará tu progreso.')) {
                onReset();
              }
            }}
            style={{
              background: '#E8E8E8',
              color: '#888',
              fontSize: '1rem',
              minHeight: '45px'
            }}
          >
            🔄 Borrar progreso
          </button>
        )}
      </div>

      {/* Progress indicator */}
      {progress && progress.currentLevel > 1 && (
        <div style={{
          marginTop: '30px',
          padding: '12px 24px',
          background: 'rgba(255,255,255,0.8)',
          borderRadius: '16px',
          fontSize: '1rem',
          color: '#5D4037'
        }}>
          🌟 Nivel {progress.currentLevel - 1} completado
        </div>
      )}

      {/* Floating animals decoration */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        fontSize: '2rem',
        opacity: 0.6,
        animation: 'bounce 3s ease infinite'
      }}>🐕</div>
      <div style={{
        position: 'absolute',
        bottom: '40px',
        right: '30px',
        fontSize: '2rem',
        opacity: 0.6,
        animation: 'bounce 2.5s ease infinite 0.5s'
      }}>🐈</div>
      <div style={{
        position: 'absolute',
        top: '100px',
        right: '20px',
        fontSize: '1.5rem',
        opacity: 0.4,
        animation: 'bounce 4s ease infinite 1s'
      }}>🐇</div>
    </div>
  );
}
