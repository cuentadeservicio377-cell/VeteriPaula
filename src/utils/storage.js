/**
 * localStorage wrapper for game progress
 */

const STORAGE_KEY = 'veterin_paula_progress';

export function getProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Error reading progress:', e);
  }
  return { currentLevel: 1, completedLevels: [], stars: {} };
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Error saving progress:', e);
  }
}

export function completeLevel(levelId, stars = 3) {
  const progress = getProgress();
  if (!progress.completedLevels.includes(levelId)) {
    progress.completedLevels.push(levelId);
  }
  progress.stars[levelId] = stars;
  if (levelId >= progress.currentLevel) {
    progress.currentLevel = levelId + 1;
  }
  saveProgress(progress);
  return progress;
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
  return { currentLevel: 1, completedLevels: [], stars: {} };
}
