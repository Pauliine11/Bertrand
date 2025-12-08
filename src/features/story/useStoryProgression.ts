import { useState, useEffect, useCallback } from 'react';
import { StoryLevel } from './types';
import { INITIAL_STORY_LEVELS } from './data';

export function useStoryProgression() {
  const [levels, setLevels] = useState<StoryLevel[]>(INITIAL_STORY_LEVELS);

  // Charger la progression depuis le localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('bertrand-story-progress');
    if (saved) {
      try {
        setLevels(JSON.parse(saved));
      } catch (e) {
        console.error("Erreur lors du chargement de la progression", e);
      }
    }
  }, []);

  // Sauvegarder à chaque changement
  useEffect(() => {
    localStorage.setItem('bertrand-story-progress', JSON.stringify(levels));
  }, [levels]);

  const completeLevel = useCallback((levelId: string) => {
    setLevels(currentLevels => {
      const levelIndex = currentLevels.findIndex(l => l.id === levelId);
      if (levelIndex === -1) return currentLevels;
      
      const level = currentLevels[levelIndex];
      if (level.status === 'completed') return currentLevels;

      const newLevels = [...currentLevels];
      newLevels[levelIndex] = { ...level, status: 'completed' };

      // Unlock next level if exists
      const nextLevelIndex = levelIndex + 1;
      if (nextLevelIndex < newLevels.length) {
        newLevels[nextLevelIndex] = { 
          ...newLevels[nextLevelIndex], 
          status: 'unlocked' 
        };
      }

      return newLevels;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setLevels(INITIAL_STORY_LEVELS);
  }, []);

  const currentLevel = levels.find(l => l.status === 'unlocked') || levels[levels.length - 1];
  const completedCount = levels.filter(l => l.status === 'completed').length;
  const progressPercentage = (completedCount / levels.length) * 100;

  return {
    levels,
    completeLevel,
    resetProgress,
    currentLevel,
    progressPercentage
  };
}

