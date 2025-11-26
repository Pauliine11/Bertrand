'use client';

import { useState, useEffect } from 'react';

export interface Version {
  content: string;
  timestamp: Date;
}

export function useVersionHistory(initialContent: string) {
  const [value, setValue] = useState(initialContent);
  const [versionHistory, setVersionHistory] = useState<Version[]>([]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState<number>(-1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Détecter les changements non sauvegardés
  useEffect(() => {
    if (value === initialContent && versionHistory.length === 0) {
      return;
    }

    const lastSavedContent = versionHistory.length > 0 
      ? versionHistory[versionHistory.length - 1].content 
      : null;
    
    if (value === lastSavedContent) {
      setHasUnsavedChanges(false);
      return;
    }

    setHasUnsavedChanges(true);
  }, [value, versionHistory, initialContent]);

  // Sauvegarder une version
  const saveVersion = (content: string = value) => {
    const newVersion: Version = {
      content,
      timestamp: new Date(),
    };
    const updatedHistory = [...versionHistory, newVersion];
    setVersionHistory(updatedHistory);
    setCurrentVersionIndex(updatedHistory.length - 1);
    setHasUnsavedChanges(false);
    return newVersion;
  };

  // Aller à la version précédente
  const goToPreviousVersion = () => {
    if (currentVersionIndex > 0) {
      const newIndex = currentVersionIndex - 1;
      setCurrentVersionIndex(newIndex);
      setValue(versionHistory[newIndex].content);
    }
  };

  // Aller à la version suivante
  const goToNextVersion = () => {
    if (currentVersionIndex < versionHistory.length - 1) {
      const newIndex = currentVersionIndex + 1;
      setCurrentVersionIndex(newIndex);
      setValue(versionHistory[newIndex].content);
    }
  };

  // Supprimer la version actuelle
  const deleteCurrentVersion = () => {
    if (currentVersionIndex < 0 || versionHistory.length === 0) return false;

    const updatedHistory = versionHistory.filter((_, index) => index !== currentVersionIndex);
    setVersionHistory(updatedHistory);
    
    if (updatedHistory.length === 0) {
      setCurrentVersionIndex(-1);
      setValue(initialContent);
    } else if (currentVersionIndex >= updatedHistory.length) {
      const newIndex = updatedHistory.length - 1;
      setCurrentVersionIndex(newIndex);
      setValue(updatedHistory[newIndex].content);
    } else {
      setValue(updatedHistory[currentVersionIndex].content);
    }

    return true;
  };

  return {
    value,
    setValue,
    versionHistory,
    currentVersionIndex,
    hasUnsavedChanges,
    saveVersion,
    goToPreviousVersion,
    goToNextVersion,
    deleteCurrentVersion,
  };
}

