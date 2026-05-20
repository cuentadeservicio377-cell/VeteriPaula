import { useEffect, useState, useMemo } from 'react';
import { getProgress } from '../../utils/storage.js';
import { getAnimalSpriteUrl } from '../../hooks/usePixelArt.js';
import { spriteToDataURL } from '../../utils/spriteToImage.js';
import { ANIMAL_PIXEL_DEFS } from '../../game-engine/sprites/Characters.js';
import { ICON_SPRITES } from '../../game-engine/sprites/UI.js';

const PIXEL_STYLE = { imageRendering: 'pixelated', display: 'block' };

export default function HomeScreen({ onPlay, onSelectLevel, onReset }) {
  const [progress, setProgress] = useState(null);
  useEffect(() => { setProgress(getProgress()); }, []);

  // Pre-generate sprite URLs
  const sprites = useMemo(() => {
    const urls = {};
    urls.perro = getAnimalSpriteUrl('perro', 3);
    urls.gato = getAnimalSpriteUrl('gato', 3);
    urls.conejo = getAnimalSpriteUrl('conejo', 3);
    urls.paula = spriteToDataURL([
      'TTTTTH1H1H1H1H1TTTT',
      'TTTH1H1S1S1S1H1H1TTT',
      'TTH1S1E2E2E2S1H1TT',
      'TS1E2E1E3E1E2S1T',
      'TS1E2E1E3E1E2S1T',
      'TS1S1B1TTB1S1S1T',
      'TS1S1S1S1S1S1S1T',
      'TC1C1C1C1C1C1C1T',
      'TC1C1C2C2C1C1C1T',
      'TC1C1C2C2C1C1C1T',
      'TC1C1C1C1C1C1C1T',
      'TTTC5C5C5TTTT',
      'TTTC5C5C5TTTT',
    ], 4);
    urls.star = spriteToDataURL(ICON_SPRITES.star, 4);
    urls.arrowRight = spriteToDataURL(ICON_SPRITES.arrowRight, 4);
    urls.arrowLeft = spriteToDataURL(ICON_SPRITES.arrowLeft, 4);
    urls.check = spriteToDataURL(ICON_SPRITES.check, 4);
    return urls;
  }, []);

  return (
    <div className="screen-container" style={{ background: 'linear-gradient(180deg, #FFF5F5 0%, #FFE4E1 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Floating pixel art decorations */}
      {sprites.perro && (
        <img src={sprites.perro} alt="" style={{ position: 'absolute', top: '8%', left: '5%', opacity: 0.4, animation: 'bounce 4s ease infinite', ...PIXEL_STYLE, width: '48px', height: '40px' }} />
      )}
      {sprites.gato && (
        <img src={sprites.gato} alt="" style={{ position: 'absolute', top: '12%', right: '8%', opacity: 0.35, animation: 'bounce 3.5s ease infinite 0.5s', ...PIXEL_STYLE, width: '48px', height: '40px' }} />
      )}
      {sprites.conejo && (
        <img src={sprites.conejo} alt="" style={{ position: 'absolute', bottom: '15%', left: '8%', opacity: 0.35, animation: 'bounce 5s ease infinite 1s', ...PIXEL_STYLE, width: '48px', height: '40px' }} />
      )}

      {/* Main content */}
      <div style={{ textAlign: 'center', zIndex: 2 }}>
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 800, color: '#5D4037', margin: 0, textShadow: '3px 3px 0px rgba(255,107,107,0.25)' }}>
          Veterin Paula
        </h1>
        <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', color: '#8D6E63', marginTop: '12px', fontWeight: 600 }}>
          Aprende a leer curando animales
        </p>
      </div>

      {/* Paula character pixel art */}
      <div style={{ margin: '20px 0', animation: 'bounce 2.2s ease infinite', zIndex: 2 }}>
        {sprites.paula && (
          <img src={sprites.paula} alt="Paula" style={{ ...PIXEL_STYLE, width: '80px', height: '80px', margin: '0 auto' }} />
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '340px', zIndex: 2 }}>
        <button className="touch-button" onClick={onPlay} style={{ background: '#FF6B6B', color: '#fff', boxShadow: '0 6px 20px rgba(255,107,107,0.35)', fontSize: '1.6rem', minHeight: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          {sprites.arrowRight && (
            <img src={sprites.arrowRight} alt="" style={{ ...PIXEL_STYLE, width: '28px', height: '28px' }} />
          )}
          Jugar
        </button>
        {progress && progress.currentLevel > 1 && (
          <button className="touch-button" onClick={onSelectLevel} style={{ background: '#C7CEEA', color: '#5D4037', fontSize: '1.3rem', minHeight: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            Elegir Nivel
          </button>
        )}
        {progress && progress.currentLevel > 1 && (
          <button className="touch-button" onClick={() => { if (confirm('¿Borrar tu progreso?')) onReset(); }} style={{ background: '#E8E8E8', color: '#888', fontSize: '1rem', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {sprites.arrowLeft && (
              <img src={sprites.arrowLeft} alt="" style={{ ...PIXEL_STYLE, width: '16px', height: '16px', transform: 'rotate(180deg)' }} />
            )}
            Empezar de nuevo
          </button>
        )}
      </div>

      {/* Progress */}
      {progress && progress.currentLevel > 1 && (
        <div style={{ marginTop: '25px', padding: '14px 28px', background: 'rgba(255,255,255,0.85)', borderRadius: '20px', fontSize: '1.1rem', color: '#5D4037', fontWeight: 700, zIndex: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {sprites.star && (
            <img src={sprites.star} alt="" style={{ ...PIXEL_STYLE, width: '20px', height: '20px' }} />
          )}
          Nivel {progress.currentLevel - 1} completado
        </div>
      )}
    </div>
  );
}
