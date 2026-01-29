'use client';

import React, { useState, useRef, useEffect, FormEvent, useTransition } from 'react';
import Image from 'next/image';
import { useSnackbar } from '@/hooks/useSnackbar';
import { Snackbar } from '@/components/ui/Snackbar';
import { GameState, ChatMessage } from '@/types';
import { playTurn } from '@/actions/game-actions';
import { StoryProgress } from '@/features/story/StoryProgress';
import { useStoryProgression } from '@/features/story/useStoryProgression';
import { useLanguage } from '@/context/LanguageContext';

// Default fallback image when character images don't exist
const DEFAULT_CHARACTER_IMAGE = '/characters/hermione/neutral.jpg';

export default function ImmersiveRPG() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { levels, completeLevel } = useStoryProgression();
  const [selectedLevel, setSelectedLevel] = useState<typeof levels[0] | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    character_reply: '',
    mood: 'sad', // Will be overwritten by dynamic level content if available
    game_over: false,
    game_won: false,
    suggested_actions: ["Saluer doucement", "Demander de l'aide pour un sort", "S'asseoir en silence", "Lui demander ce qui ne va pas"]
  });
  const [isPending, startTransition] = useTransition();
  const [inputText, setInputText] = useState('');
  const [showGrimoire, setShowGrimoire] = useState(false);
  const [imageError, setImageError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { snackbar, showSnackbar } = useSnackbar();

  // Scroll automatique vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper function to get character folder based on level content
  const getCharacterFolder = () => {
    const character = selectedLevel?.content?.character?.toLowerCase() || 'hermione';
    
    // Normalize character name to folder name
    // "Hermione Granger" -> "hermione"
    // "Hagrid" -> "hagrid"
    // "Draco Malfoy" -> "draco"
    // etc.
    
    if (character.includes('hermione')) return 'hermione';
    if (character.includes('hagrid')) return 'hagrid';
    if (character.includes('draco')) return 'draco';
    if (character.includes('harry')) return 'harry';
    if (character.includes('ron')) return 'ron';
    if (character.includes('dumbledore')) return 'dumbledore';
    if (character.includes('snape') || character.includes('rogue')) return 'snape';
    
    // For custom characters, use first name only (sanitized)
    const firstName = character.split(' ')[0].trim();
    return firstName.replace(/[^a-z0-9]/g, '') || 'hermione';
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialisation du jeu
  useEffect(() => {
    if (!selectedLevel) return;
    
    // Reset image error when level changes
    setImageError(false);
    
    // Message initial (contexte pour l'affichage, pas envoyé à l'API tout de suite)
    const initialMessage = selectedLevel?.content?.initial_message || "Je... je ne sais pas ce que je fais encore ici. Tout semble si vain. Je pense que je vais faire mes valises ce soir.";
    
    setMessages([{
      role: 'assistant',
      content: initialMessage
    }]);

    if (selectedLevel?.content?.suggested_actions) {
        setGameState(prev => ({
            ...prev,
            suggested_actions: selectedLevel.content.suggested_actions,
            mood: selectedLevel.content.initial_mood || 'sad'
        }));
    }
  }, [selectedLevel]);

  // Preload images based on selected character
  useEffect(() => {
    if (!selectedLevel) return;
    
    const characterFolder = getCharacterFolder();
    const imageExtension = characterFolder === 'hagrid' ? 'jpg' : 'jpg';
    const imagesToPreload = [
      `/characters/${characterFolder}/neutral.${imageExtension}`,
      `/characters/${characterFolder}/sad.${imageExtension}`,
      `/characters/${characterFolder}/angry.${imageExtension}`,
      `/characters/${characterFolder}/happy.${imageExtension}`,
      `/characters/${characterFolder}/desperate.${imageExtension}`
    ];
    
    imagesToPreload.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }, [selectedLevel]);

  const handleSendMessage = async (e?: FormEvent, forcedText?: string) => {
    e?.preventDefault();
    const userMessage = forcedText || inputText;

    if (!userMessage.trim() || isPending || gameState.game_over || gameState.game_won) return;

    setInputText('');
    
    // Ajouter le message utilisateur
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    // Vérification de la progression de l'histoire (Legacy / Tutorial Mode)
    const lowerMsg = userMessage.toLowerCase();
    
    // Only use hardcoded triggers if we are in the default static Hermione scenario (no dynamic content)
    if (!selectedLevel?.content) {
        // Fonction helper pour compléter un niveau par son ordre (1-5)
        const completeByOrder = (order: number) => {
          const level = levels.find(l => l.order === order);
          if (level && level.status !== 'completed') {
            completeLevel(level.id);
          }
        };

        if (lowerMsg.includes('bonjour') || lowerMsg.includes('salut')) completeByOrder(1);
        if (lowerMsg.includes('wingardium') || lowerMsg.includes('leviosa') || lowerMsg.includes('lévitation')) completeByOrder(2);
        if (lowerMsg.includes('écoute') || lowerMsg.includes('ecoute')) completeByOrder(3);
        if (lowerMsg.includes('temps') || lowerMsg.includes('retourneur')) completeByOrder(4);
    }

    startTransition(async () => {
      try {
        const data = await playTurn(
            newMessages.map(m => ({ role: m.role, content: m.content })),
            selectedLevel?.content // Pass dynamic context
        );

        // Mise à jour de l'état du jeu
        setGameState(data);

        // Ajouter la réponse d'Hermione / Personnage
        if (data.character_reply) {
          setMessages(prev => [...prev, { role: 'assistant', content: data.character_reply }]);
        }

        if (data.game_won) {
          // Complete the current level regardless of whether it's dynamic or static
          if (selectedLevel) {
             completeLevel(selectedLevel.id);
          }
          showSnackbar("VICTOIRE - Bravo !", "success");
        } else if (data.game_over) {
          showSnackbar("GAME OVER.", "error");
        }

      } catch (error) {
        console.error(error);
        showSnackbar("Une erreur magique est survenue...", "error");
      }
    });
  };

  // Déterminer la couleur de la jauge (Removed)
  // Image d'ambiance selon l'humeur et le personnage
  const characterFolder = getCharacterFolder();
  
  // Determine file extension (some characters use PNG, others JPG)
  const imageExtension = characterFolder === 'hagrid' ? 'jpg' : 'jpg'; // Can be changed per character
  
  let moodImage = `/characters/${characterFolder}/neutral.${imageExtension}`;
  
  // If image failed to load, use default Hermione image
  if (imageError) {
    moodImage = DEFAULT_CHARACTER_IMAGE;
  } else {
    switch (gameState.mood) {
      case 'sad': moodImage = `/characters/${characterFolder}/sad.${imageExtension}`; break;
      case 'angry': moodImage = `/characters/${characterFolder}/angry.${imageExtension}`; break;
      case 'happy': moodImage = `/characters/${characterFolder}/happy.${imageExtension}`; break;
      case 'desperate': moodImage = `/characters/${characterFolder}/desperate.${imageExtension}`; break;
      default: moodImage = `/characters/${characterFolder}/neutral.${imageExtension}`;
    }
  }

  return (
    <div className="h-[calc(100vh-9rem)] bg-gray-900 text-white font-sans relative overflow-hidden flex flex-col">
      {/* Background sobre */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900 to-gray-800 opacity-50"></div>
      </div>

      {/* Level Selection Screen */}
      {!selectedLevel && (
        <div className="absolute inset-0 z-50 bg-gray-900 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-serif text-center text-indigo-300 mb-4">
              {t('rpg.selectTitle')}
            </h1>
            <p className="text-center text-gray-400 mb-8 text-lg">
              {t('rpg.selectSubtitle')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level)}
                  className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 rounded-xl p-6 text-left transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20"
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {level.status === 'completed' ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30 whitespace-nowrap">
                        ✓ {t('rpg.status.completed')}
                      </span>
                    ) : level.status === 'unlocked' ? (
                      <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full border border-indigo-500/30 whitespace-nowrap">
                        {t('rpg.status.available')}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full border border-gray-500/30 whitespace-nowrap">
                        {t('rpg.status.locked')}
                      </span>
                    )}
                  </div>

                  {/* Level Number */}
                  <div className="text-6xl font-bold text-indigo-500/20 mb-2">
                    {level.order}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-indigo-300 transition-colors pr-24">
                    {level.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {level.description}
                  </p>

                  {/* Character Info */}
                  {level.content?.character && (
                    <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-900/20 px-3 py-1.5 rounded-full border border-indigo-700/30 w-fit">
                      <span>👤</span>
                      <span className="whitespace-nowrap">{level.content.character}</span>
                    </div>
                  )}

                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </button>
              ))}
            </div>

            {levels.length === 0 && (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📖</span>
                <p className="text-xl text-gray-300 mb-2">{t('rpg.emptyTitle')}</p>
                <p className="text-gray-500 text-sm">{t('rpg.emptySubtitle')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header du Jeu */}
      {selectedLevel && (
        <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={() => {
                setSelectedLevel(null);
                setMessages([]);
                setGameState({
                  character_reply: '',
                  mood: 'sad',
                  game_over: false,
                  game_won: false,
                  suggested_actions: ["Saluer doucement", "Demander de l'aide pour un sort", "S'asseoir en silence", "Lui demander ce qui ne va pas"]
                });
              }}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 rounded-lg text-gray-300 hover:text-white text-sm transition-colors flex items-center gap-2 flex-shrink-0"
            >
              ← {t('rpg.backToLevels')}
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-serif text-indigo-300 truncate">
                  {selectedLevel?.title || t('level.hermione.title')}
              </h1>
              <p className="text-gray-400 text-sm italic truncate">
                  {selectedLevel?.description || t('level.hermione.description')}
              </p>
            </div>
            <button
              onClick={() => setShowGrimoire(true)}
              className="px-3 py-2 bg-indigo-900/50 hover:bg-indigo-800/50 border border-indigo-700/50 rounded-lg text-indigo-200 text-sm transition-colors flex items-center gap-2 flex-shrink-0"
            >
              📜 {t('rpg.grimoire')}
            </button>
          </div>
        
        {/* Departure Risk Gauge Removed */}
        </header>
      )}

      {/* Zone principale : Avatar + Chat */}
      {selectedLevel && (
        <main className="relative z-10 flex-1 flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Avatar / État (Gauche) */}
        <div className="md:w-1/3 flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl">
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 rounded-full overflow-hidden border-4 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            <Image
              src={moodImage}
              alt={selectedLevel?.content?.character || 'Character'}
              fill
              className="object-cover transition-all duration-700"
              onError={() => setImageError(true)}
            />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-serif text-white mb-2">
                {selectedLevel?.content?.character || 'Hermione Granger'}
            </h2>
            <p className="text-indigo-200 italic font-medium text-base">
              {gameState.mood === 'sad' ? '"C\'est sans espoir..."' :
               gameState.mood === 'angry' ? '"Laissez-moi tranquille !"' :
               gameState.mood === 'happy' ? '"Peut-être avez-vous raison..."' :
               gameState.mood === 'desperate' ? '"Je ne peux plus supporter ça."' :
               '"..."'}
            </p>
          </div>
        </div>

        {/* Zone de Chat (Droite) */}
        <div className="md:w-2/3 flex flex-col bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden relative">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-[80%] p-4 rounded-2xl text-sm md:text-base leading-relaxed
                  ${msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-900/20' 
                    : 'bg-gray-800 text-gray-100 rounded-bl-none border border-white/5 shadow-lg'}
                `}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isPending && (
              <div className="flex justify-start">
                <div className="bg-gray-800 p-4 rounded-2xl rounded-bl-none border border-white/5 flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Game Over / Win Overlay */}
          {(gameState.game_over || gameState.game_won) && (
            <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 z-50 animate-fade-in">
              <h2 className={`text-5xl font-serif mb-4 ${gameState.game_won ? 'text-green-400' : 'text-red-500'}`}>
                {gameState.game_won ? t('rpg.victory') : t('rpg.gameOver')}
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                {gameState.game_won 
                  ? t('rpg.victoryText')
                  : t('rpg.gameOverText')}
              </p>
              <button 
                onClick={() => {
                  setSelectedLevel(null);
                  setMessages([]);
                  setGameState({
                    character_reply: '',
                    mood: 'sad',
                    game_over: false,
                    game_won: false,
                    suggested_actions: ["Saluer doucement", "Demander de l'aide pour un sort", "S'asseoir en silence", "Lui demander ce qui ne va pas"]
                  });
                }}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors"
              >
                {t('rpg.backButton')}
              </button>
            </div>
          )}

          {/* Suggestions de dialogue */}
          {!gameState.game_over && !gameState.game_won && gameState.suggested_actions && (
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto custom-scrollbar">
              {gameState.suggested_actions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(undefined, action)}
                  disabled={isPending}
                  className="whitespace-nowrap px-4 py-2 bg-white/5 hover:bg-indigo-600/20 hover:border-indigo-500/30 border border-white/10 rounded-full text-xs text-gray-300 transition-all hover:text-white"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-gray-900/50 border-t border-white/10">
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('rpg.inputPlaceholder')}
                className="w-full bg-gray-800/50 text-white border border-white/10 rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-gray-500 transition-all"
                disabled={isPending || gameState.game_over || gameState.game_won}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isPending || gameState.game_over || gameState.game_won}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ➤
              </button>
            </form>
          </div>
        </div>
        </main>
      )}

      {/* Grimoire Overlay */}
      {showGrimoire && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-gray-900 rounded-lg shadow-2xl overflow-hidden animate-scale-in">
            <button
              onClick={() => setShowGrimoire(false)}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
            <div className="p-6">
              <StoryProgress />
            </div>
          </div>
        </div>
      )}

      <Snackbar {...snackbar} />
    </div>
  );
}
