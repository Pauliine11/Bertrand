'use client';

import { FormEvent, KeyboardEvent, useRef, useState } from 'react';
import { Loader } from '@/components/ui/Loader';
import { Message } from '@/features/chat/Message';
import { TextArea } from '@/components/ui/TextArea';
import { useChatMessages } from '@/hooks/useChatMessages';

export default function Home() {
  const { messages, ref, sendMessage, isLoading, error, currentEmotion } = useChatMessages();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = String(formData.get('user'));

    if (user.trim()) {
      sendMessage(user);
    e.currentTarget.reset();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  // Afficher l'erreur si elle existe
  if (error) {
    alert(`Error: ${error.message}\n\nPlease check:\n1. Your API key is set in .env.local\n2. You have credits in your OpenAI account\n3. Check the browser console for details`);
  }

  return (
    <main className="w-full max-w-3xl mx-auto lg:ml-auto lg:mr-12 flex flex-col px-6 md:px-12 py-8 md:py-12 h-full relative">
      {/* Responsive: 
        - Mobile: px-6, py-8, mx-auto (centré)
        - Tablet: px-12, py-12
        - Desktop: max-w-3xl, décalé à droite pour laisser place à l'image Bertrand
      */}
      
      <div className="flex-1 flex flex-col gap-6 overflow-auto relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-center text-gray-900 dark:text-white tracking-tight leading-tight mt-8 md:mt-12 minimal-fade-in">
          BERTRAND
        </h1>
        <ul ref={ref} className="flex flex-col flex-1 mt-6 md:mt-8 space-y-4 md:space-y-6">
          {messages.map((message, i) => (
            <Message message={message} key={`${typeof message.content === 'string' ? message.content : 'message'}-${i}`} />
          ))}
          {messages.length === 0 && (
            <li className="text-gray-500 text-center text-base md:text-lg py-12 leading-relaxed">
              💬 Aucun message pour le moment.<br />
              <span className="text-sm">Commencez une conversation avec Bertrand !</span>
            </li>
          )}

          {isLoading && (
            <li className="flex items-center justify-center w-full p-6 gap-3">
              <Loader />
              <p className="text-gray-600 text-sm md:text-base">
                Bertrand réfléchit...
              </p>
            </li>
          )}
        </ul>
      </div>
      
      {/* Form responsive avec sticky sur mobile */}
      <form ref={formRef} onSubmit={handleSubmit} className="relative z-10 mt-6">
        <fieldset disabled={isLoading} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
          <div className="flex-1 w-full">
            <TextArea 
              name="user" 
              label="Votre message" 
              onKeyDown={handleKeyDown}
            />
          </div>
          <button
            type="submit"
            className="minimal-button px-6 py-3 sm:py-2.5 whitespace-nowrap"
          >
            Envoyer
          </button>
        </fieldset>
      </form>

      {/* Emotion Display */}
      {currentEmotion && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm flex flex-wrap gap-4 items-center justify-center animate-fade-in relative z-10">
          <span className="font-medium text-gray-700">Émotion :</span>
          <span className="capitalize text-indigo-600 font-semibold">{currentEmotion.emotion}</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">Intensité : {currentEmotion.intensity}</span>
          <span className="text-gray-300">|</span>
          <span className={`text-gray-500 ${currentEmotion.valence === 'positive' ? 'text-green-600' : currentEmotion.valence === 'negative' ? 'text-red-500' : 'text-gray-500'}`}>
             {currentEmotion.valence === 'positive' ? 'Positive' : currentEmotion.valence === 'negative' ? 'Négative' : 'Neutre'}
          </span>
        </div>
      )}
    </main>
  );
}