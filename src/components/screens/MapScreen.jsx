import { useMemo } from 'react';
import { levels } from '../../data/levels.js';
import { vocabulary } from '../../data/vocabulary.js';

const biomeIcons = {
  home: '🏠',
  farm: '🌾',
  forest: '🌲',
  jungle: '🌴'
};

export default function MapScreen({ progress, onSelectLevel, onBack }) {
  const biomes = useMemo(() => {
    const grouped = {};
    levels.forEach(level => {
      if (!grouped[level.biome]) grouped[level.biome] = [];
      grouped[level.biome].push(level);
    });
    return grouped;
  }, []);

  const isUnlocked = (levelId) => {
    return levelId <= progress.currentLevel;
  };

  const isCompleted = (levelId) => {
    return progress.completedLevels.includes(levelId);
  };

  return (
    <div className="screen-container" style={{
      background: '#FFF8F0',
      overflowY: 'auto',
      justifyContent: 'flex-start',
      paddingTop: '20px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '20px',
        width: '100%',
        maxWidth: '600px'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          ⬅️
        </button>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          color: '#5D4037',
          margin: 0
        }}>
          🗺️ Mapa de Niveles
        </h2>
      </div>

      {Object.entries(biomes).map(([biomeKey, biomeLevels]) => {
        const biomeInfo = vocabulary[biomeKey];
        return (
          <div key={biomeKey} style={{
            width: '100%',
            maxWidth: '600px',
            marginBottom: '24px',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '20px',
            padding: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '1.8rem' }}>{biomeIcons[biomeKey]}</span>
              <h3 style={{
                margin: 0,
                fontSize: '1.2rem',
                color: biomeInfo?.color || '#5D4037'
              }}>
                {biomeInfo?.name || biomeKey}
              </h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(55px, 1fr))',
              gap: '8px'
            }}>
              {biomeLevels.map(level => {
                const unlocked = isUnlocked(level.id);
                const completed = isCompleted(level.id);
                
                return (
                  <button
                    key={level.id}
                    onClick={() => unlocked && onSelectLevel(level.id)}
                    disabled={!unlocked}
                    style={{
                      width: '55px',
                      height: '55px',
                      borderRadius: '14px',
                      border: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      fontFamily: 'Nunito, sans-serif',
                      cursor: unlocked ? 'pointer' : 'default',
                      background: completed
                        ? '#B5EAD7'
                        : unlocked
                          ? biomeInfo?.color || '#FFDac1'
                          : '#E0E0E0',
                      color: completed
                        ? '#2E7D32'
                        : unlocked
                          ? '#5D4037'
                          : '#999',
                      opacity: unlocked ? 1 : 0.5,
                      transition: 'transform 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => unlocked && (e.target.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => unlocked && (e.target.style.transform = 'scale(1)')}
                  >
                    {completed ? '⭐' : level.id}
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
