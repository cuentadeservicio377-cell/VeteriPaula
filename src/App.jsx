import { useState, useCallback } from 'react';
import { getProgress, saveProgress, completeLevel, resetProgress } from './utils/storage.js';
import { getLevel, getTotalLevels } from './data/levels.js';
import { getCharacterForLevel } from './data/characters.js';
import HomeScreen from './components/screens/HomeScreen.jsx';
import MapScreen from './components/screens/MapScreen.jsx';
import CelebrationScreen from './components/screens/CelebrationScreen.jsx';
import GameCanvas from './components/game/GameCanvas.jsx';

/**
 * Main App with simple state-based routing
 */
function App() {
  const [screen, setScreen] = useState('home'); // home, map, game, celebration
  const [currentLevel, setCurrentLevel] = useState(1);
  const [progress, setProgress] = useState(getProgress());
  const [levelData, setLevelData] = useState(null);

  const startGame = useCallback((levelId) => {
    const data = getLevel(levelId);
    if (!data) return;
    
    // Add character info to level data
    const enrichedData = {
      ...data,
      character: getCharacterForLevel(levelId)
    };
    
    setCurrentLevel(levelId);
    setLevelData(enrichedData);
    setScreen('game');
  }, []);

  const handlePlay = useCallback(() => {
    startGame(progress.currentLevel);
  }, [progress.currentLevel, startGame]);

  const handleLevelComplete = useCallback(() => {
    const newProgress = completeLevel(currentLevel);
    setProgress(newProgress);
    setScreen('celebration');
  }, [currentLevel]);

  const handleNextLevel = useCallback(() => {
    const nextLevel = currentLevel + 1;
    if (nextLevel > getTotalLevels()) {
      setScreen('home');
    } else {
      startGame(nextLevel);
    }
  }, [currentLevel, startGame]);

  const handleReset = useCallback(() => {
    const newProgress = resetProgress();
    setProgress(newProgress);
    setScreen('home');
  }, []);

  // Render current screen
  switch (screen) {
    case 'home':
      return (
        <HomeScreen
          onPlay={handlePlay}
          onSelectLevel={() => setScreen('map')}
          onReset={handleReset}
        />
      );

    case 'map':
      return (
        <MapScreen
          progress={progress}
          onSelectLevel={startGame}
          onBack={() => setScreen('home')}
        />
      );

    case 'game':
      if (!levelData) return null;
      return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <GameCanvas
            levelData={levelData}
            onComplete={handleLevelComplete}
            onFail={() => { /* Fail is handled within the game */ }}
          />
          {/* Back button overlay */}
          <button
            onClick={() => setScreen('home')}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '12px',
              padding: '8px 16px',
              fontSize: '1rem',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            🏠
          </button>
        </div>
      );

    case 'celebration':
      if (!levelData) return null;
      return (
        <CelebrationScreen
          levelData={levelData}
          onNext={handleNextLevel}
          onHome={() => setScreen('home')}
        />
      );

    default:
      return <HomeScreen onPlay={handlePlay} onSelectLevel={() => setScreen('map')} onReset={handleReset} />;
  }
}

export default App;
