'use client';

import React, { FormEvent, useCallback } from "react";
import MDEditor from '@uiw/react-md-editor';
import { Loader } from '@/components/Loader';
import { Message } from '@/components/Message';
import { TextArea } from '@/components/TextArea';
import { Snackbar } from '@/components/Snackbar';
import { DraftModeToggle } from '@/components/DraftModeToggle';
import { useVersionHistory } from '@/hooks/useVersionHistory';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useDraftMode } from '@/hooks/useDraftMode';
import { useChatWithDraft } from '@/hooks/useChatWithDraft';

export default function BertrandEditorSpace() {
  // ===== HOOKS PERSONNALISÉS =====
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

  const handleSaveMarkdown = () => {
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
  };

  const handleDeleteVersion = () => {
    if (currentVersionIndex < 0 || versionHistory.length === 0) return;

    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer la version ${currentVersionIndex + 1} ?`
    );

    if (!confirmDelete) return;

    const success = deleteCurrentVersion();
    if (success) {
      showSnackbar('🗑️ Version supprimée avec succès', 'info');
    }
  };

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

  // Gérer les erreurs
  if (error) {
    showSnackbar('❌ Erreur lors de l\'envoi du message', 'error');
  }

  // ========== RENDU ==========
  return (
    <div className="flex h-screen w-full pt-16">
      
      {/* ========== ÉDITEUR MARKDOWN ========== */}
      <div className="w-1/2 p-4 overflow-auto border-r border-[#d4af37]">
        
        {/* En-tête */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center flex-1 font-[family-name:var(--font-cormorant)] text-white tracking-wider">
            MARKDOWN EDITOR
          </h1>
          
          {/* Bouton de sauvegarde avec indicateur */}
          <div className="relative">
            <button
              onClick={handleSaveMarkdown}
              className="text-[#fdf6e3] bg-gradient-to-r from-[#722f37] via-[#8b2635] to-[#722f37] hover:from-[#8b2635] hover:to-[#722f37] focus:ring-4 focus:outline-none focus:ring-[#d4af37] border border-[#d4af37] font-medium rounded-lg text-sm px-4 py-2 text-center transition-all hover:shadow-lg hover:shadow-[#d4af37]/20"
            >
              💾 Sauvegarder
            </button>
            {hasUnsavedChanges && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full animate-pulse border-2 border-white"></div>
            )}
          </div>
        </div>
        
        {/* Panneau de contrôle des versions */}
        {versionHistory.length > 0 && (
          <div className="mb-4 p-3 border-2 border-[#d4af37] rounded-lg bg-[#722f37]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[#d4af37] font-bold text-lg">
                  Version {currentVersionIndex + 1} / {versionHistory.length}
                </span>
                {currentVersionIndex >= 0 && (
                  <span className="text-[#fdf6e3] text-sm">
                    {versionHistory[currentVersionIndex].timestamp.toLocaleString('fr-FR')}
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={goToPreviousVersion}
                  disabled={currentVersionIndex <= 0}
                  className="text-[#fdf6e3] bg-[#722f37] hover:bg-[#8b2635] disabled:opacity-30 disabled:cursor-not-allowed border border-[#d4af37] font-medium rounded px-3 py-1 text-sm transition-all"
                >
                  ← Précédent
                </button>
                <button
                  onClick={goToNextVersion}
                  disabled={currentVersionIndex >= versionHistory.length - 1}
                  className="text-[#fdf6e3] bg-[#722f37] hover:bg-[#8b2635] disabled:opacity-30 disabled:cursor-not-allowed border border-[#d4af37] font-medium rounded px-3 py-1 text-sm transition-all"
                >
                  Suivant →
                </button>
                <button
                  onClick={handleDeleteVersion}
                  disabled={currentVersionIndex < 0}
                  className="text-[#fdf6e3] bg-red-700 hover:bg-red-800 disabled:opacity-30 disabled:cursor-not-allowed border border-red-500 font-medium rounded px-3 py-1 text-sm transition-all"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Éditeur */}
        <MDEditor
          value={value}
          onChange={(val) => setValue(val || '')}
          height={400}
        />
        
        {/* Preview */}
        <div className="mt-4">
          <h2 className="text-xl font-bold text-white mb-2">Preview:</h2>
          <MDEditor.Markdown 
            source={value}
            style={{ whiteSpace: 'pre-wrap' }}
          />
        </div>
      </div>

      {/* ========== CHAT INTERFACE ========== */}
      <div className="w-1/2 flex flex-col p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center flex-1 font-[family-name:var(--font-cormorant)] text-white tracking-wider">
            BERTRAND CHAT
          </h1>
          
          {/* Bouton Mode Draft */}
          <DraftModeToggle isDraftMode={isDraftMode} onToggle={toggleDraftMode} />
        </div>
        
        <div className="flex-1 flex flex-col gap-4 overflow-auto">
          {/* Indicateur du mode Draft */}
          {isDraftMode && (
            <div className="bg-[#d4af37]/20 border-2 border-[#d4af37] rounded-lg p-3 mb-2">
              <p className="text-[#d4af37] font-bold text-sm flex items-center gap-2">
                <span>✨</span>
                <span>Mode Draft activé : Les réponses de Bertrand modifieront directement l'éditeur</span>
              </p>
              <p className="text-[#fdf6e3] text-xs mt-1">
                Le contenu de votre éditeur sera automatiquement partagé avec Bertrand pour un meilleur contexte.
              </p>
            </div>
          )}
          
          <ul ref={ref} className="flex flex-col flex-1">
            {messages.map((message, i) => (
              <Message 
                message={message}
                key={`${typeof message.content === 'string' ? message.content : 'message'}-${i}`}
              />
            ))}
            
            {messages.length === 0 && !isDraftMode && (
              <li className="text-[#fdf6e3] italic opacity-75">
                Il n'y a pas encore de messages, commencez une conversation !
              </li>
            )}
            
            {messages.length === 0 && isDraftMode && (
              <li className="text-[#fdf6e3] italic opacity-75">
                Mode Draft : Demandez à Bertrand de modifier votre document. Par exemple : "Corrige les fautes", "Améliore le style", "Traduis en anglais"...
              </li>
            )}

            {isLoading && (
              <li className="flex items-center w-full p-4">
                <Loader />
                <p className="text-[#d4af37] animate-pulse italic">
                  Bertrand est en train de réfléchir...
                </p>
              </li>
            )}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <fieldset disabled={isLoading} className="flex items-end gap-2">
            <div className="flex-1">
              <TextArea 
                name="user"
                label={isDraftMode ? "✨ Votre instruction pour modifier le document :" : "Vôtre message :"}
              />
            </div>
            
            <button
              type="submit"
              className={`font-medium rounded-lg text-sm px-4 py-2.5 text-center leading-5 transition-all ${
                isDraftMode
                  ? 'text-[#722f37] bg-[#d4af37] hover:bg-[#ffd700] border-2 border-[#d4af37] shadow-lg shadow-[#d4af37]/30'
                  : 'text-[#fdf6e3] bg-gradient-to-r from-[#722f37] via-[#8b2635] to-[#722f37] hover:from-[#8b2635] hover:to-[#722f37] focus:ring-4 focus:outline-none focus:ring-[#d4af37] border border-[#d4af37] hover:shadow-lg hover:shadow-[#d4af37]/20'
              }`}
            >
              {isDraftMode ? '✨ Modifier le document' : 'Envoyer'}
            </button>
          </fieldset>
        </form>
      </div>

      {/* ========== SNACKBAR ========== */}
      <Snackbar {...snackbar} />
    </div>
  );
}
