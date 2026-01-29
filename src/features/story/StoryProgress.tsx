import React from 'react';
import { useStoryProgression } from './useStoryProgression';
import { StoryLevel } from './types';
import { useLanguage } from '@/context/LanguageContext';

export const StoryProgress = () => {
  const { t } = useLanguage();
  const { levels, currentLevel, progressPercentage } = useStoryProgression();

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-xl font-serif">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
        <h2 className="text-2xl font-serif text-gray-200 flex items-center gap-2">
          <span className="text-2xl">📖</span>
          {t('progress.title')}
        </h2>
      </div>

      <div className="space-y-3">
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

  const getStyles = () => {
    if (level.status === 'completed') {
      return 'bg-green-900/20 border-l-4 border-green-500';
    } else if (level.status === 'unlocked') {
      return 'bg-indigo-900/20 border-l-4 border-indigo-500';
    } else {
      return 'bg-gray-900/20 border-l-4 border-gray-600 opacity-50';
    }
  };

  return (
    <div className={`
      flex items-start gap-3 p-4 rounded-lg
      transition-colors
      ${getStyles()}
      ${isCurrent ? 'ring-1 ring-indigo-500' : ''}
    `}>
      <span className="text-2xl" role="img" aria-label={level.status}>
        {getIcon()}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className={`
          font-semibold text-gray-200 mb-1
          ${level.status === 'completed' ? 'line-through decoration-green-500/50' : ''}
        `}>
          {level.title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          {level.description}
        </p>
      </div>
    </div>
  );
};

