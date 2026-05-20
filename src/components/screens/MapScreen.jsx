import { useMemo } from 'react';
import { levels } from '../../data/levels-v2.js';

export default function MapScreen({ progress, blocks, onSelectLevel, onBack }) {
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

  return (
    <div className="screen-container" style={{ background: '#FFF8F0', overflowY: 'auto', justifyContent: 'flex-start', paddingTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '24px', width: '100%', maxWidth: '600px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', padding: '8px' }}>⬅️</button>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#5D4037', margin: 0 }}>🗺️ Mapa de Aventuras</h2>
      </div>

      {blocks.map(block => {
        const blockLevels = grouped[block.id] || [];
        const isBlockUnlocked = blockLevels.some(l => isUnlocked(l.id));
        const isBlockComplete = blockLevels.every(l => isCompleted(l.id));

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
              <span style={{ fontSize: '2rem' }}>{block.emoji}</span>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: block.color }}>{block.name}</h3>
              {isBlockComplete && <span style={{ fontSize: '1.2rem' }}>✅</span>}
              {!isBlockUnlocked && <span style={{ fontSize: '1.2rem' }}>🔒</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '10px' }}>
              {blockLevels.map(level => {
                const unlocked = isUnlocked(level.id);
                const completed = isCompleted(level.id);
                return (
                  <button key={level.id} onClick={() => unlocked && onSelectLevel(level.id)}
                    disabled={!unlocked}
                    style={{
                      width: '60px', height: '60px', borderRadius: '16px', border: 'none',
                      fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'Nunito, sans-serif',
                      cursor: unlocked ? 'pointer' : 'default',
                      background: completed ? block.color : unlocked ? '#FFF' : '#E8E8E8',
                      color: completed ? '#fff' : unlocked ? block.color : '#999',
                      boxShadow: completed ? `0 3px 12px ${block.color}40` : '0 2px 6px rgba(0,0,0,0.08)',
                      opacity: unlocked ? 1 : 0.5,
                      transition: 'transform 0.15s ease',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => unlocked && (e.target.style.transform = 'scale(1.12)')}
                    onMouseLeave={(e) => unlocked && (e.target.style.transform = 'scale(1)')}
                  >
                    {completed ? '⭐' : level.emoji}
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
