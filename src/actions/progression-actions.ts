'use server';

import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { StoryLevel, LevelStatus } from '@/features/story/types';
import { revalidatePath } from 'next/cache';

interface LevelRow {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_active: boolean;
}

interface UserLevelProgressRow {
  level_id: string;
  is_completed: boolean;
}

export async function fetchUserProgression(): Promise<StoryLevel[]> {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    // 1. Fetch all levels
    const { data: levelsData, error: levelsError } = await supabase
      .from('levels')
      .select('id, title, description, order_index, is_active, content')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (levelsError) throw levelsError;

    // 2. Fetch user progress
    // We assume 'is_completed' boolean column instead of 'status' text
    const { data: progressData, error: progressError } = await supabase
      .from('user_level_progress')
      .select('level_id, is_completed')
      .eq('user_id', userId);

    if (progressError && progressError.code !== 'PGRST116') {
       console.warn("Error fetching progress:", progressError);
    }

    const completedLevelIds = new Set(
      (progressData || [])
        .filter((p: any) => p.is_completed)
        .map((p: any) => p.level_id)
    );

    // 3. Merge and determine status
    const levels: StoryLevel[] = (levelsData || []).map((level, index) => {
        let status: LevelStatus = 'locked';
        
        if (completedLevelIds.has(level.id)) {
            status = 'completed';
        } else {
            // Check if previous level is completed
            const prevLevelId = index > 0 ? (levelsData || [])[index - 1].id : null;
            if (!prevLevelId || completedLevelIds.has(prevLevelId)) {
                status = 'unlocked';
            }
        }

        return {
            id: level.id,
            title: level.title,
            description: level.description || '',
            order: level.order_index, 
            status,
            content: level.content
        };
    });

    return levels;

  } catch (error) {
    console.error('Error fetching progression:', error);
    return [];
  }
}

export async function completeLevelAction(levelId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  try {
    const { error } = await supabase
      .from('user_level_progress')
      .upsert({ 
        user_id: userId, 
        level_id: levelId, 
        is_completed: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id, level_id' });

    if (error) throw error;
    
    revalidatePath('/immersive/immersive-rpg');
    return { success: true };
  } catch (error) {
    console.error('Error completing level:', error);
    return { success: false };
  }
}
