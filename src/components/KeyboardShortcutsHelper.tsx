'use client';

import { useState } from 'react';

export function KeyboardShortcutsHelper() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: ['Ctrl', 'S'], description: 'Sauvegarder le document' },
    { keys: ['Ctrl', 'D'], description: 'Toggle Mode Draft' },
    { keys: ['Ctrl', 'K'], description: 'Focus sur le chat' },
    { keys: ['Ctrl', 'Enter'], description: 'Envoyer le message' },
  ];

  return (
    <div className="fixed bottom-6 left-20 z-50">
      {/* Bouton pour ouvrir/fermer */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white hover:bg-gray-50:bg-slate-700 text-gray-700 border-2 border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110"
        title="Raccourcis clavier"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
        </svg>
      </button>

      {/* Panel des raccourcis */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 bg-white border-2 border-gray-200 rounded-lg shadow-2xl p-4 w-80 animate-slide-in">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-gray-900">⌨️ Raccourcis Clavier</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded bg-gray-50 hover:bg-gray-100:bg-slate-700 transition-colors"
              >
                <span className="text-xs text-gray-600">{shortcut.description}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, i) => (
                    <kbd
                      key={i}
                      className="px-2 py-1 text-xs font-bold bg-gray-200 text-gray-800 rounded border border-gray-300 shadow-sm"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 italic">
              💡 Utilisez Cmd au lieu de Ctrl sur Mac
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
