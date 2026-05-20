import { useState, useCallback } from 'react';
import { getProgress, completeLevel, resetProgress } from './utils/storage.js';
import { getLevel, getTotalLevels, getBlocks, getBlockForLevel } from './data/levels-v2.js';
import { getCharacterForLevel } from './data/characters.js';
import HomeScreen from './components/screens/HomeScreen.jsx';
import MapScreen from './components/screens/MapScreen.jsx';
import LoadingScreen from './components/screens/LoadingScreen.jsx';
import CelebrationScreen from './components/screens/CelebrationScreen.jsx';
import GameCanvas from './components/game/GameCanvas.jsx';

function App() {
  const [screen, setScreen] = useState('home');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [progress, setProgress] = useState(getProgress());
  const [levelData, setLevelData] = useState(null);
  const [nextBiome, setNextBiome] = useState('clinica');

  const startGame = useCallback((levelId) => {
    const data = getLevel(levelId);
    if (!data) return;
    const block = getBlockForLevel(levelId);
    const enrichedData = {
      ...data,
      character: getCharacterForLevel(levelId),
      blockColor: block?.color || '#FF6B6B',
    };
    setCurrentLevel(levelId);
    setLevelData(enrichedData);
    setNextBiome(data.biome);
    setScreen('game');
  }, []);

  const handlePlay = useCallback(() => {
    const data = getLevel(progress.currentLevel);
    if (data) setNextBiome(data.biome);
    setScreen('loading');
  }, [progress.currentLevel]);

  const handleLoadingReady = useCallback(() => {
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
      const nextData = getLevel(nextLevel);
      if (nextData) setNextBiome(nextData.biome);
      setScreen('loading');
      setTimeout(() => startGame(nextLevel), 100);
    }
  }, [currentLevel, startGame]);

  const handleReset = useCallback(() => {
    const newProgress = resetProgress();
    setProgress(newProgress);
    setScreen('home');
  }, []);

  switch (screen) {
    case 'home':
      return <HomeScreen onPlay={handlePlay} onSelectLevel={() => setScreen('map')} onReset={handleReset} />;
    case 'map':
      return <MapScreen progress={progress} blocks={getBlocks()} onSelectLevel={(id) => { setScreen('loading'); setTimeout(() => startGame(id), 100); }} onBack={() => setScreen('home')} />;
    case 'loading':
      return <LoadingScreen nextBiome={nextBiome} onReady={handleLoadingReady} />;
    case 'game':
      if (!levelData) return null;
      return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <GameCanvas levelData={levelData} onComplete={handleLevelComplete} onFail={() => {}} />
          <button onClick={() => setScreen('home')} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '12px', padding: '8px 16px', fontSize: '1rem', cursor: 'pointer', zIndex: 10 }}>🏠</button>
        </div>
      );
    case 'celebration':
      if (!levelData) return null;
      return <CelebrationScreen levelData={levelData} onNext={handleNextLevel} onHome={() => setScreen('home')} />;
    default:
      return <HomeScreen onPlay={handlePlay} onSelectLevel={() => setScreen('map')} onReset={handleReset} />;
  }
}

export default App;
