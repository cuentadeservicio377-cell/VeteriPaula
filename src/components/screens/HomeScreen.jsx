import { useEffect, useState } from 'react';
import { getProgress } from '../../utils/storage.js';

export default function HomeScreen({ onPlay, onSelectLevel, onReset }) {
  const [progress, setProgress] = useState(null);
  useEffect(() => { setProgress(getProgress()); }, []);

  return (
    <div className="screen-container" style={{ background: 'linear-gradient(180deg, #FFF5F5 0%, #FFE4E1 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Floating decorations */}
      <div style={{ position: 'absolute', top: '8%', left: '5%', fontSize: '2.5rem', opacity: 0.4, animation: 'bounce 4s ease infinite' }}>🐕</div>
      <div style={{ position: 'absolute', top: '12%', right: '8%', fontSize: '2rem', opacity: 0.35, animation: 'bounce 3.5s ease infinite 0.5s' }}>🐈</div>
      <div style={{ position: 'absolute', bottom: '15%', left: '8%', fontSize: '2.2rem', opacity: 0.35, animation: 'bounce 5s ease infinite 1s' }}>🐇</div>
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', fontSize: '2rem', opacity: 0.3, animation: 'bounce 4.5s ease infinite 1.5s' }}>🌸</div>

      {/* Main content */}
      <div style={{ textAlign: 'center', zIndex: 2 }}>
        <div style={{ fontSize: 'clamp(4rem, 12vw, 7rem)', marginBottom: '5px', animation: 'bounce 2s ease infinite' }}>🐾</div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 800, color: '#5D4037', margin: 0, textShadow: '3px 3px 0px rgba(255,107,107,0.25)' }}>
          Veterin Paula
        </h1>
        <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', color: '#8D6E63', marginTop: '12px', fontWeight: 600 }}>
          ¡Aprende a leer curando animales! ❤️
        </p>
      </div>

      {/* Paula character */}
      <div style={{ fontSize: 'clamp(5rem, 14vw, 9rem)', margin: '20px 0', animation: 'bounce 2.2s ease infinite', zIndex: 2 }}>👩‍⚕️</div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '340px', zIndex: 2 }}>
        <button className="touch-button" onClick={onPlay} style={{ background: '#FF6B6B', color: '#fff', boxShadow: '0 6px 20px rgba(255,107,107,0.35)', fontSize: '1.6rem', minHeight: '70px' }}>
          ▶️ ¡Jugar!
        </button>
        {progress && progress.currentLevel > 1 && (
          <button className="touch-button" onClick={onSelectLevel} style={{ background: '#C7CEEA', color: '#5D4037', fontSize: '1.3rem', minHeight: '55px' }}>
            🗺️ Elegir Nivel
          </button>
        )}
        {progress && progress.currentLevel > 1 && (
          <button className="touch-button" onClick={() => { if (confirm('¿Borrar tu progreso?')) onReset(); }} style={{ background: '#E8E8E8', color: '#888', fontSize: '1rem', minHeight: '48px' }}>
            🔄 Empezar de nuevo
          </button>
        )}
      </div>

      {/* Progress */}
      {progress && progress.currentLevel > 1 && (
        <div style={{ marginTop: '25px', padding: '14px 28px', background: 'rgba(255,255,255,0.85)', borderRadius: '20px', fontSize: '1.1rem', color: '#5D4037', fontWeight: 700, zIndex: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          🌟 Nivel {progress.currentLevel - 1} completado
        </div>
      )}
    </div>
  );
}
