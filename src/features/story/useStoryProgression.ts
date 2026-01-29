import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUserProgression, completeLevelAction } from '@/actions/progression-actions';
import { INITIAL_STORY_LEVELS } from './data';
import { StoryLevel } from './types';

export function useStoryProgression() {
  const queryClient = useQueryClient();

  const { data: levels = INITIAL_STORY_LEVELS, refetch } = useQuery({
    queryKey: ['story-progression'],
    queryFn: async () => {
      const dbLevels = await fetchUserProgression();
      
      // Always include the default Hermione scenario levels
      // Then add custom database levels after them
      const allLevels = [...INITIAL_STORY_LEVELS];
      
      if (dbLevels && dbLevels.length > 0) {
        // Add DB levels with adjusted order to come after default levels
        const maxDefaultOrder = Math.max(...INITIAL_STORY_LEVELS.map(l => l.order));
        const customLevels = dbLevels.map((level, index) => ({
          ...level,
          order: maxDefaultOrder + index + 1
        }));
        allLevels.push(...customLevels);
      }
      
      return allLevels;
    }
  });

  const { mutate: completeLevel } = useMutation({
    mutationFn: async (levelId: string) => {
      await completeLevelAction(levelId);
    },
    onMutate: async (newLevelId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['story-progression'] });

      // Snapshot the previous value
      const previousLevels = queryClient.getQueryData<StoryLevel[]>(['story-progression']);

      // Optimistically update
      if (previousLevels) {
        queryClient.setQueryData<StoryLevel[]>(['story-progression'], (old) => {
           if (!old) return [];
           
           const newLevels = old.map(level => {
             if (level.id === newLevelId) {
               return { ...level, status: 'completed' } as StoryLevel;
             }
             return level;
           });

           // Simple logic to unlock next level optimistically
           const completedIndex = newLevels.findIndex(l => l.id === newLevelId);
           if (completedIndex !== -1 && completedIndex + 1 < newLevels.length) {
              // Only unlock if not already completed
              if (newLevels[completedIndex + 1].status === 'locked') {
                  newLevels[completedIndex + 1] = { 
                      ...newLevels[completedIndex + 1], 
                      status: 'unlocked' 
                  };
              }
           }
           
           return newLevels;
        });
      }

      return { previousLevels };
    },
    onError: (err, newLevelId, context) => {
      // Rollback on error
      if (context?.previousLevels) {
        queryClient.setQueryData(['story-progression'], context.previousLevels);
      }
      console.error("Failed to complete level:", err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story-progression'] });
    }
  });

  // Reset not implemented for DB version yet, or could delete rows
  const resetProgress = () => {
      console.warn("Reset progress not implemented for DB persistence");
  };

  const currentLevel = levels.find((l: StoryLevel) => l.status === 'unlocked') || levels[levels.length - 1];
  const completedCount = levels.filter((l: StoryLevel) => l.status === 'completed').length;
  const progressPercentage = levels.length > 0 ? (completedCount / levels.length) * 100 : 0;

  return {
    levels,
    completeLevel,
    resetProgress,
    currentLevel,
    progressPercentage,
    refetch
  };
}
