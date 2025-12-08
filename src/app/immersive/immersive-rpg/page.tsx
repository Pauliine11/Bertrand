'use client';

import React, { useState, useRef, useEffect, FormEvent, useTransition } from 'react';
import Image from 'next/image';
import { useSnackbar } from '@/hooks/useSnackbar';
import { Snackbar } from '@/components/ui/Snackbar';
import { GameState, ChatMessage } from '@/types';
import { playTurn } from '@/actions/game-actions';

// Types pour le jeu
// (Removed local interfaces)

export default function ImmersiveRPG() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    character_reply: '',
    mood: 'sad',
    departure_risk: 50,
    game_over: false,
    game_won: false,
    suggested_actions: ["Qu'est ce qui ne va pas ?", "Lui rappeler Harry et Ron", "Lui offrir une écoute attentive", "Bloquer le passage"]
  });
  const [isPending, startTransition] = useTransition();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { snackbar, showSnackbar } = useSnackbar();

  // Scroll automatique vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialisation du jeu
  useEffect(() => {
    // Message initial (contexte pour l'affichage, pas envoyé à l'API tout de suite)
    setMessages([{
      role: 'assistant',
      content: "Je... je ne sais pas ce que je fais encore ici. Tout semble si vain. Je pense que je vais faire mes valises ce soir."
    }]);
  }, []);

  // Preload images
  useEffect(() => {
    const imagesToPreload = [
      '/hermione/neutral.jpg',
      '/hermione/sad.jpg',
      '/hermione/angry.jpg',
      '/hermione/happy.jpg',
      '/hermione/desperate.jpg'
    ];
    
    imagesToPreload.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  const handleSendMessage = async (e?: FormEvent, forcedText?: string) => {
    e?.preventDefault();
    const userMessage = forcedText || inputText;

    if (!userMessage.trim() || isPending || gameState.game_over || gameState.game_won) return;

    setInputText('');
    
    // Ajouter le message utilisateur
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    startTransition(async () => {
      try {
        const data = await playTurn(newMessages.map(m => ({ role: m.role, content: m.content })));

        // Mise à jour de l'état du jeu
        setGameState(data);

        // Ajouter la réponse d'Hermione
        if (data.character_reply) {
          setMessages(prev => [...prev, { role: 'assistant', content: data.character_reply }]);
        }

        if (data.game_over) {
          showSnackbar("GAME OVER - Hermione a quitté Poudlard.", "error");
        } else if (data.game_won) {
          showSnackbar("VICTOIRE - Hermione a retrouvé espoir !", "success");
        }

      } catch (error) {
        console.error(error);
        showSnackbar("Une erreur magique est survenue...", "error");
      }
    });
  };

  // Déterminer la couleur de la jauge
  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'bg-green-500';
    if (risk < 60) return 'bg-yellow-500';
    return 'bg-red-600';
  };

  // Image d'ambiance selon l'humeur
  let moodImage = '/hermione/neutral.jpg';
  switch (gameState.mood) {
    case 'sad': moodImage = '/hermione/sad.jpg'; break;
    case 'angry': moodImage = '/hermione/angry.jpg'; break;
    case 'happy': moodImage = '/hermione/happy.jpg'; break;
    case 'desperate': moodImage = '/hermione/desperate.jpg'; break;
    default: moodImage = '/hermione/neutral.jpg';
  }

  return (
    <div className="h-[calc(100vh-9rem)] bg-gray-900 text-white font-sans relative overflow-hidden flex flex-col">
      {/* Background Immersive */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900 to-gray-800 opacity-50"></div>
      </div>

      {/* Header du Jeu */}
      <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-serif text-indigo-300">Salle Commune</h1>
          <p className="text-gray-400 text-sm font-serif italic">Il est tard. Hermione est seule.</p>
        </div>
        
        {/* Jauge de Risque de Départ */}
        <div className="w-64">
          <div className="flex justify-between text-xs mb-1 font-medium">
            <span className="text-gray-300 uppercase tracking-wider">Détermination à partir</span>
            <span className={`${gameState.departure_risk > 80 ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
              {gameState.departure_risk}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden border border-white/10 shadow-inner">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${getRiskColor(gameState.departure_risk)}`} 
              style={{ width: `${gameState.departure_risk}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Zone principale : Avatar + Chat */}
      <main className="relative z-10 flex-1 flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Avatar / État (Gauche) */}
        <div className="md:w-1/3 flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl">
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 rounded-full overflow-hidden border-4 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            <Image
              src={moodImage}
              alt="Hermione"
              fill
              className="object-cover transition-all duration-700"
            />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-serif text-white mb-2">Hermione Granger</h2>
            <p className="text-indigo-200 italic font-medium font-serif text-lg">
              {gameState.mood === 'sad' ? '"C\'est sans espoir..."' :
               gameState.mood === 'angry' ? '"Laissez-moi tranquille !"' :
               gameState.mood === 'happy' ? '"Peut-être avez-vous raison..."' :
               gameState.mood === 'desperate' ? '"Je ne peux plus supporter ça."' :
               '"..."'}
            </p>
          </div>
        </div>

        {/* Zone de Chat (Droite) */}
        <div className="md:w-2/3 flex flex-col bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden">
          
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
                {gameState.game_won ? 'Victoire !' : 'Game Over'}
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                {gameState.game_won 
                  ? "Vous avez réussi à redonner espoir à Hermione. Elle décide de rester à Poudlard pour se battre à vos côtés."
                  : "Hermione a pris ses affaires et a quitté le château dans la nuit. Poudlard a perdu l'un de ses plus brillants esprits."}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-200 transition-transform active:scale-95"
              >
                Recommencer l'histoire
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
                placeholder="Que dites-vous à Hermione ?"
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

      <Snackbar {...snackbar} />
    </div>
  );
}

