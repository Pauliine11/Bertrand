'use client';

import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlOrMeta = (e.ctrlKey && shortcut.ctrlKey) || (e.metaKey && shortcut.metaKey);
        const shiftMatch = shortcut.shiftKey ? e.shiftKey : !e.shiftKey;
        
        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlOrMeta &&
          shiftMatch
        ) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Hook avec raccourcis prédéfinis pour Bertrand
export function useBertrandShortcuts({
  onSave,
  onToggleDraft,
  onFocusChat,
}: {
  onSave?: () => void;
  onToggleDraft?: () => void;
  onFocusChat?: () => void;
}) {
  const shortcuts: KeyboardShortcut[] = [];

  if (onSave) {
    shortcuts.push({
      key: 's',
      ctrlKey: true,
      metaKey: true,
      action: onSave,
      description: 'Sauvegarder le document',
    });
  }

  if (onToggleDraft) {
    shortcuts.push({
      key: 'd',
      ctrlKey: true,
      metaKey: true,
      action: onToggleDraft,
      description: 'Toggle Mode Draft',
    });
  }

  if (onFocusChat) {
    shortcuts.push({
      key: 'k',
      ctrlKey: true,
      metaKey: true,
      action: onFocusChat,
      description: 'Focus sur le chat',
    });
  }

  useKeyboardShortcuts(shortcuts);
}

