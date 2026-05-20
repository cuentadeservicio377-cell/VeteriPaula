import { useMemo, useEffect, useState } from 'react';
import { levels } from '../../data/levels-v2.js';
import { getBiomeSpriteUrl, getIconSpriteUrl, getAnimalSpriteUrl } from '../../hooks/usePixelArt.js';
import { useTTS } from '../../hooks/useTTS.js';

export default function MapScreen({ progress, blocks, onSelectLevel, onBack }) {
  const { speak } = useTTS();
  const grouped = useMemo(() => {
    const g = {};
    levels.forEach(l => {
      if (!g[l.block]) g[l.block] = [];
      g[l.block].push(l);
    });
    return g;
  }, []);

  const isUnlocked = (levelId) => levelId <= progress.currentLevel;
  const isCompleted = (levelId) => progress.completedLevels.includes(levelId);
  const getStars = (levelId) => progress.stars?.[levelId] || 0;

  // Pre-generate sprite URLs
  const [spriteUrls, setSpriteUrls] = useState({});

  useEffect(() => {
    const urls = {};
    blocks.forEach(block => {
      urls[`biome_${block.biome}`] = getBiomeSpriteUrl(block.biome, 4);
    });
    urls.arrowLeft = getIconSpriteUrl('arrowLeft', 4);
    urls.star = getIconSpriteUrl('star', 4);
    urls.lock = getIconSpriteUrl('lock', 4);
    urls.check = getIconSpriteUrl('check', 4);
    levels.forEach(l => {
      urls[`animal_${l.animal}`] = getAnimalSpriteUrl(l.animal, 3);
    });
    setSpriteUrls(urls);
  }, [blocks]);

  const imgStyle = {
    imageRendering: 'pixelated',
    display: 'block',
  };

  return (
    <div className="screen-container" style={{ background: '#FFF8F0', overflowY: 'auto', justifyContent: 'flex-start', paddingTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '24px', width: '100%', maxWidth: '600px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
          {spriteUrls.arrowLeft && (
            <img src={spriteUrls.arrowLeft} alt="Atrás" style={{ ...imgStyle, width: '32px', height: '32px' }} />
          )}
        </button>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#5D4037', margin: 0 }}>
          Mapa de Aventuras
        </h2>
      </div>

      {blocks.map(block => {
        const blockLevels = grouped[block.id] || [];
        const isBlockUnlocked = blockLevels.some(l => isUnlocked(l.id));
        const isBlockComplete = blockLevels.every(l => isCompleted(l.id));
        const biomeUrl = spriteUrls[`biome_${block.biome}`];

        return (
          <div key={block.id} style={{
            width: '100%', maxWidth: '600px', marginBottom: '24px',
            background: isBlockComplete ? block.bgColor : 'rgba(255,255,255,0.92)',
            borderRadius: '24px', padding: '18px',
            boxShadow: '0 3px 15px rgba(0,0,0,0.06)',
            border: `3px solid ${isBlockComplete ? block.color : '#E0E0E0'}`,
            opacity: isBlockUnlocked ? 1 : 0.6,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              {biomeUrl && (
                <img src={biomeUrl} alt={block.name} style={{ ...imgStyle, width: '48px', height: '48px' }} />
              )}
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: block.color }}>{block.name}</h3>
              {isBlockComplete && spriteUrls.check && (
                <img src={spriteUrls.check} alt="Completado" style={{ ...imgStyle, width: '24px', height: '24px' }} />
              )}
              {!isBlockUnlocked && spriteUrls.lock && (
                <img src={spriteUrls.lock} alt="Bloqueado" style={{ ...imgStyle, width: '24px', height: '24px' }} />
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '10px' }}>
              {blockLevels.map(level => {
                const unlocked = isUnlocked(level.id);
                const completed = isCompleted(level.id);
                const stars = getStars(level.id);
                const animalUrl = spriteUrls[`animal_${level.animal}`];

                return (
                  <button key={level.id} onClick={() => {
                      if (unlocked) {
                        speak(`${level.title}. ${level.animal}`, { rate: 0.85 });
                        onSelectLevel(level.id);
                      }
                    }}
                    disabled={!unlocked}
                    style={{
                      width: '60px', height: '72px', borderRadius: '16px', border: 'none',
                      fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'Nunito, sans-serif',
                      cursor: unlocked ? 'pointer' : 'default',
                      background: completed ? block.color : unlocked ? '#FFF' : '#E8E8E8',
                      color: completed ? '#fff' : unlocked ? block.color : '#999',
                      boxShadow: completed ? `0 3px 12px ${block.color}40` : '0 2px 6px rgba(0,0,0,0.08)',
                      opacity: unlocked ? 1 : 0.5,
                      transition: 'transform 0.15s ease',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: '2px',
                      padding: '4px 0',
                    }}
                    onMouseEnter={(e) => unlocked && (e.target.style.transform = 'scale(1.12)')}
                    onMouseLeave={(e) => unlocked && (e.target.style.transform = 'scale(1)')}
                  >
                    {completed && stars > 0 ? (
                      <div style={{ display: 'flex', gap: '1px' }}>
                        {[1, 2, 3].map(s => (
                          <img key={s} src={spriteUrls.star} alt="" style={{
                            ...imgStyle, width: '14px', height: '14px',
                            opacity: s <= stars ? 1 : 0.2,
                          }} />
                        ))}
                      </div>
                    ) : null}
                    {animalUrl ? (
                      <img src={animalUrl} alt={level.animal} style={{ ...imgStyle, width: '32px', height: '28px' }} />
                    ) : (
                      <span style={{ fontSize: '0.9rem' }}>{level.id}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
