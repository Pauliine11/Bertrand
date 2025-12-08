import React from 'react';
import { useStoryProgression } from './useStoryProgression';
import { StoryLevel } from './types';

export const StoryProgress = () => {
  const { levels, currentLevel, progressPercentage } = useStoryProgression();

  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 shadow-sm font-serif">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-amber-900">Grimoire de Progression</h2>
        <span className="text-amber-700 text-sm font-bold">{Math.round(progressPercentage)}% complété</span>
      </div>

      <div className="w-full bg-amber-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-amber-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="space-y-4">
        {levels.map((level) => (
          <LevelItem key={level.id} level={level} isCurrent={currentLevel?.id === level.id} />
        ))}
      </div>
    </div>
  );
};

const LevelItem = ({ level, isCurrent }: { level: StoryLevel, isCurrent: boolean }) => {
  const getIcon = () => {
    switch (level.status) {
      case 'completed': return '✅';
      case 'locked': return '🔒';
      case 'unlocked': return '📜';
    }
  };

  const getOpacity = () => {
    if (level.status === 'locked') return 'opacity-50';
    return 'opacity-100';
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-md transition-colors ${getOpacity()} ${isCurrent ? 'bg-amber-100 ring-1 ring-amber-300' : ''}`}>
      <span className="text-2xl" role="img" aria-label={level.status}>
        {getIcon()}
      </span>
      <div>
        <h3 className={`font-bold text-amber-900 ${level.status === 'completed' ? 'line-through decoration-amber-900/50' : ''}`}>
          {level.title}
        </h3>
        <p className="text-amber-800 text-sm leading-relaxed">
          {level.description}
        </p>
      </div>
    </div>
  );
};

