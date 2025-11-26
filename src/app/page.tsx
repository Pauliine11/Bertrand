'use client';

import { FormEvent } from 'react';
import Image from 'next/image';
import { Loader } from '@/components/Loader';
import { Message } from '@/components/Message';
import { TextArea } from '@/components/TextArea';
import { useChatMessages } from '@/hooks/useChatMessages';

export default function Home() {
  const { messages, ref, sendMessage, isLoading, error } = useChatMessages();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = String(formData.get('user'));

    if (user.trim()) {
      sendMessage(user);
      e.currentTarget.reset();
    }
  };

  // Afficher l'erreur si elle existe
  if (error) {
    alert(`Error: ${error.message}\n\nPlease check:\n1. Your API key is set in .env.local\n2. You have credits in your OpenAI account\n3. Check the browser console for details`);
  }

  return (
    <main className="m-auto max-w-xl flex flex-col px-2 py-8 h-full relative pt-20">
      {/* pt-20 pour compenser la hauteur de la navbar fixe */}
        
        {/* Background image on the left */}
        <div className="fixed left-0 top-0 bottom-0 w-1/3 opacity-75 pointer-events-none z-0">
          <Image 
            src="/bertrand.png" 
            alt="Bertrand background" 
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
        </div>
        <div className="flex-1 flex flex-col gap-4 overflow-auto mt-8 relative z-10">
        <h1 className="text-2xl md:text-5xl font-bold text-center font-[family-name:var(--font-cormorant)] text-white tracking-wider">
          BERTRAND
        </h1>
        <ul ref={ref} className="flex flex-col flex-1 mt-8">
          {messages.map((message, i) => (
            <Message message={message} key={`${typeof message.content === 'string' ? message.content : 'message'}-${i}`} />
          ))}
          {messages.length === 0 && <li className="text-[#fdf6e3] italic opacity-75">Il n'y a pas encore de messages, commencez une conversation !</li>}

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
      <form onSubmit={handleSubmit} className="relative z-10">
        <fieldset disabled={isLoading} className="flex items-end gap-2 mt-8">
          <div className="flex-1">
            <TextArea name="user" label="Vôtre message :" />
          </div>
          <button
            type="submit"
            className="text-[#fdf6e3] bg-gradient-to-r from-[#722f37] via-[#8b2635] to-[#722f37] hover:from-[#8b2635] hover:to-[#722f37] focus:ring-4 focus:outline-none focus:ring-[#d4af37] border border-[#d4af37] font-medium rounded-lg text-sm px-4 py-2.5 text-center leading-5 transition-all hover:shadow-lg hover:shadow-[#d4af37]/20"
          >
            Envoyer
          </button>
        </fieldset>
      </form>
    </main>
  );
}