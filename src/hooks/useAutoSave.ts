'use client';

import { useEffect, useState } from 'react';

interface UseAutoSaveOptions {
  value: string;
  onSave: () => void;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave({ 
  value, 
  onSave, 
  delay = 2000, 
  enabled = true 
}: UseAutoSaveOptions) {
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    setIsSaving(true);
    
    const timer = setTimeout(() => {
      onSave();
      setIsSaving(false);
    }, delay);

    return () => {
      clearTimeout(timer);
      setIsSaving(false);
    };
  }, [value, onSave, delay, enabled]);

  return { isSaving };
}

