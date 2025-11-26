'use client';

import { useState, useCallback } from 'react';

export function useDraftMode() {
  const [isDraftMode, setIsDraftMode] = useState(false);

  const toggleDraftMode = useCallback(() => {
    setIsDraftMode(prev => !prev);
  }, []);

  const enableDraftMode = useCallback(() => {
    setIsDraftMode(true);
  }, []);

  const disableDraftMode = useCallback(() => {
    setIsDraftMode(false);
  }, []);

  // Fonction pour formater un message avec le contexte de l'éditeur
  const formatMessageWithContext = useCallback((userMessage: string, editorContent: string) => {
    return `Voici le contenu de mon document : 

${editorContent}

Voici la demande de l'utilisateur : ${userMessage}`;
  }, []);

  return {
    isDraftMode,
    toggleDraftMode,
    enableDraftMode,
    disableDraftMode,
    formatMessageWithContext,
  };
}

