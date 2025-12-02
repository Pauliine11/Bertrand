'use client';

import React, { FormEvent, useCallback, useState } from "react";
import MDEditor from '@uiw/react-md-editor';
import { Loader } from '@/components/Loader';
import { Message } from '@/components/Message';
import { TextArea } from '@/components/TextArea';
import { Snackbar } from '@/components/Snackbar';
import { DraftModeToggle } from '@/components/DraftModeToggle';
import { PromptSuggestions } from '@/components/PromptSuggestions';
import { KeyboardShortcutsHelper } from '@/components/KeyboardShortcutsHelper';
import { useVersionHistory } from '@/hooks/useVersionHistory';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useDraftMode } from '@/hooks/useDraftMode';
import { useChatWithDraft } from '@/hooks/useChatWithDraft';
import { useBertrandShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useIsMobile } from '@/hooks/useMediaQuery';

export default function BertrandEditorSpace() {
  // ===== HOOKS PERSONNALISÉS =====
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'editor' | 'chat'>('editor');
  const { snackbar, showSnackbar } = useSnackbar();
  const { isDraftMode, toggleDraftMode, formatMessageWithContext } = useDraftMode();
  
  const {
    value,
    setValue,
    versionHistory,
    currentVersionIndex,
    hasUnsavedChanges,
    saveVersion,
    goToPreviousVersion,
    goToNextVersion,
    deleteCurrentVersion,
  } = useVersionHistory("**Hello world!!!**");

  // Callback pour recevoir la réponse en mode draft
  const handleDraftResponse = useCallback((content: string) => {
    setValue(content);
    showSnackbar('✨ Contenu mis à jour par Bertrand !', 'success');
  }, [setValue, showSnackbar]);

  // Hook de chat avec support du mode draft
  const { messages, ref, sendMessage: sendChatMessage, isLoading, error } = useChatWithDraft({
    isDraftMode,
    onDraftResponse: handleDraftResponse,
  });

  // Auto-save callback
  const handleAutoSave = useCallback(() => {
    if (hasUnsavedChanges) {
      saveVersion();
      showSnackbar('✅ Sauvegarde automatique réussie', 'success');
    }
  }, [hasUnsavedChanges, saveVersion, showSnackbar]);

  // Auto-save hook (désactivé si pas de changements)
  useAutoSave({
    value,
    onSave: handleAutoSave,
    delay: 2000,
    enabled: hasUnsavedChanges,
  });

  // ===== FONCTIONS DE GESTION =====

  const handleSaveMarkdown = useCallback(() => {
    try {
      saveVersion();
      
      // Télécharger le fichier
      const blob = new Blob([value], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bertrand-note-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSnackbar('💾 Fichier téléchargé avec succès !', 'success');
    } catch (error) {
      showSnackbar('❌ Erreur lors de la sauvegarde', 'error');
      console.error('Erreur de sauvegarde:', error);
    }
  }, [value, saveVersion, showSnackbar]);

  const handleDeleteVersion = useCallback(() => {
    if (currentVersionIndex < 0 || versionHistory.length === 0) return;

    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer la version ${currentVersionIndex + 1} ?`
    );

    if (!confirmDelete) return;

    const success = deleteCurrentVersion();
    if (success) {
      showSnackbar('🗑️ Version supprimée avec succès', 'info');
    }
  }, [currentVersionIndex, versionHistory.length, deleteCurrentVersion, showSnackbar]);

  const handlePromptSelect = useCallback((prompt: string) => {
    // Trouver le textarea et le remplir avec le prompt
    const textarea = document.querySelector<HTMLTextAreaElement>('textarea[name="user"]');
    if (textarea) {
      textarea.value = prompt;
      textarea.focus();
    }
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const userMessage = String(formData.get('user'));

    if (userMessage.trim()) {
      // En mode draft, ajouter le contexte de l'éditeur
      const finalMessage = isDraftMode 
        ? formatMessageWithContext(userMessage, value)
        : userMessage;
      
      sendChatMessage(finalMessage);
      e.currentTarget.reset();
    }
  };

  // ===== RACCOURCIS CLAVIER =====
  useBertrandShortcuts({
    onSave: handleSaveMarkdown,
    onToggleDraft: toggleDraftMode,
    onFocusChat: () => {
      const textarea = document.querySelector<HTMLTextAreaElement>('textarea[name="user"]');
      textarea?.focus();
    },
  });

  // Gérer les erreurs
  if (error) {
    showSnackbar('❌ Erreur lors de l\'envoi du message', 'error');
  }

  // ========== RENDU ==========
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-gray-50">
      
      {/* ========== ONGLETS MOBILE ========== */}
      {isMobile && (
        <div className="flex gap-2 p-2 border-b border-gray-200 bg-white sticky top-0 z-20 shadow-sm">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'editor'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            📝 Éditeur
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            💬 Chat
          </button>
        </div>
      )}
      
      {/* ========== ÉDITEUR MARKDOWN ========== */}
      <div className={`flex-1 lg:w-1/2 p-3 md:p-4 lg:p-4 overflow-auto lg:border-r border-gray-200 bg-white ${
        isMobile && activeTab !== 'editor' ? 'hidden' : 'flex flex-col'
      }`}>
        
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 tracking-tight">
            Éditeur Markdown
          </h1>
          
          {/* Bouton de sauvegarde avec indicateur */}
          <div className="relative">
            <button
              onClick={handleSaveMarkdown}
              className="minimal-button text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap"
            >
              💾 Sauvegarder
            </button>
            {hasUnsavedChanges && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-indigo-500 rounded-full animate-pulse border-2 border-white"></div>
            )}
          </div>
        </div>
        
        {/* Panneau de contrôle des versions */}
        {versionHistory.length > 0 && (
          <div className="mb-4 p-2 sm:p-3 border-2 border-gray-200 rounded-lg bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <span className="text-gray-900 font-bold text-base sm:text-lg whitespace-nowrap">
                  Version {currentVersionIndex + 1} / {versionHistory.length}
                </span>
                {currentVersionIndex >= 0 && (
                  <span className="text-gray-600 text-xs sm:text-sm text-center">
                    {versionHistory[currentVersionIndex].timestamp.toLocaleString('fr-FR', {
                      dateStyle: 'short',
                      timeStyle: 'short'
                    })}
                  </span>
                )}
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto justify-center">
                <button
                  onClick={goToPreviousVersion}
                  disabled={currentVersionIndex <= 0}
                  className="minimal-button-secondary disabled:opacity-30 disabled:cursor-not-allowed px-2 sm:px-3 py-1 text-xs sm:text-sm"
                  aria-label="Version précédente"
                >
                  ←
                </button>
                <button
                  onClick={goToNextVersion}
                  disabled={currentVersionIndex >= versionHistory.length - 1}
                  className="minimal-button-secondary disabled:opacity-30 disabled:cursor-not-allowed px-2 sm:px-3 py-1 text-xs sm:text-sm"
                  aria-label="Version suivante"
                >
                  →
                </button>
                <button
                  onClick={handleDeleteVersion}
                  disabled={currentVersionIndex < 0}
                  className="bg-red-500 text-white hover:bg-red-600:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed border border-red-600 font-medium rounded px-2 sm:px-3 py-1 text-xs sm:text-sm transition-all"
                  aria-label="Supprimer la version"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Éditeur */}
        <div className="flex-1 overflow-hidden">
          <MDEditor
            value={value}
            onChange={(val) => setValue(val || '')}
            height={isMobile ? 300 : 400}
          />
        </div>
        
        {/* Preview - caché sur mobile pour économiser l'espace */}
        {!isMobile && (
          <div className="mt-3 overflow-auto max-h-96 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Aperçu :</h2>
            <MDEditor.Markdown 
              source={value}
              style={{ whiteSpace: 'pre-wrap' }}
            />
          </div>
        )}
      </div>

      {/* ========== CHAT INTERFACE ========== */}
      <div className={`flex-1 lg:w-1/2 flex flex-col p-3 md:p-4 lg:p-4 bg-white ${
        isMobile && activeTab !== 'chat' ? 'hidden' : 'flex'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 tracking-tight">
            Chat Bertrand
          </h1>
          
          {/* Bouton Mode Draft */}
          <DraftModeToggle isDraftMode={isDraftMode} onToggle={toggleDraftMode} />
        </div>
        
        <div className="flex-1 flex flex-col gap-3 md:gap-4 overflow-auto">
          {/* Indicateur du mode Draft */}
          {isDraftMode && (
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 sm:p-3 mb-2">
              <p className="text-indigo-700 font-bold text-xs sm:text-sm flex items-center gap-2">
                <span>✨</span>
                <span>Mode Draft : Bertrand modifiera directement l&apos;éditeur</span>
              </p>
              {!isMobile && (
                <p className="text-gray-600 text-xs mt-1">
                  Le contenu de votre éditeur sera automatiquement partagé avec Bertrand pour un meilleur contexte.
                </p>
              )}
            </div>
          )}
          
          {/* Suggestions de prompts - cachées sur mobile pour économiser l'espace */}
          {!isMobile && (
            <PromptSuggestions 
              onSelectPrompt={handlePromptSelect}
              isDraftMode={isDraftMode}
            />
          )}
          
          <ul ref={ref} className="flex flex-col flex-1 space-y-2 md:space-y-3">
            {messages.map((message, i) => (
              <Message 
                message={message}
                key={`${typeof message.content === 'string' ? message.content : 'message'}-${i}`}
              />
            ))}
            
            {messages.length === 0 && !isDraftMode && (
              <li className="text-gray-500 text-center italic text-sm py-8">
                💬 Il n&apos;y a pas encore de messages, commencez une conversation !
              </li>
            )}
            
            {messages.length === 0 && isDraftMode && (
              <li className="text-gray-600 italic text-xs sm:text-sm py-4">
                ✨ <strong>Mode Draft</strong> : Demandez à Bertrand de modifier votre document.
                {!isMobile && (
                  <>
                    <br />
                    Par exemple : &quot;Corrige les fautes&quot;, &quot;Améliore le style&quot;, &quot;Traduis en anglais&quot;...
                  </>
                )}
              </li>
            )}

            {isLoading && (
              <li className="flex items-center justify-center w-full p-4 gap-3">
                <Loader />
                <p className="text-indigo-600 animate-pulse italic text-sm">
                  Bertrand réfléchit...
                </p>
              </li>
            )}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 md:mt-4 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-3 pb-2 -mx-3 px-3 md:mx-0 md:px-0">
          <fieldset disabled={isLoading} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
            <div className="flex-1 w-full">
              <TextArea 
                name="user"
                label={isDraftMode ? "✨ Instruction :" : "Votre message :"}
              />
            </div>
            
            <button
              type="submit"
              className={`font-medium rounded-lg text-xs sm:text-sm px-4 sm:px-5 py-3 sm:py-2.5 text-center leading-5 transition-all active:scale-95 whitespace-nowrap ${
                isDraftMode
                  ? 'text-white bg-indigo-600 hover:bg-indigo-700:bg-indigo-600 border-2 border-indigo-600 shadow-lg shadow-indigo-500/30'
                  : 'minimal-button'
              }`}
            >
              {isDraftMode ? '✨ Modifier' : '📤 Envoyer'}
            </button>
          </fieldset>
        </form>
      </div>

      {/* ========== SNACKBAR ========== */}
      <Snackbar {...snackbar} />
      
      {/* ========== AIDE RACCOURCIS CLAVIER ========== */}
      <KeyboardShortcutsHelper />
    </div>
  );
}
