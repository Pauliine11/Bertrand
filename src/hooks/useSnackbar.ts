'use client';

import { useState, useCallback } from 'react';

interface SnackbarState {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function useSnackbar() {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    type: 'success',
  });

  const showSnackbar = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ open: true, message, type });
    
    // Masquer automatiquement après 3 secondes
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, open: false }));
    }, 3000);
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
  };
}

