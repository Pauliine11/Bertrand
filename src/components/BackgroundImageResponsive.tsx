'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/hooks/useSidebar';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useChatContext } from '@/context/ChatContext';

interface EmotionConfig {
  text: string;
  filter: string;
}

const EMOTION_MAP: Record<string, EmotionConfig> = {
  'tristesse': {
    text: "Tu pleures parce que t'es moche ?",
    filter: 'grayscale(0.8) contrast(1.2) drop-shadow(0 0 10px rgba(0,0,0,0.5))'
  },
  'joie': {
    text: "Quelle énergie ravissante !",
    filter: 'saturate(1.3) brightness(1.05)'
  },
  'colère': {
    text: "Tst tst, un peu de tenue je vous prie.",
    filter: 'sepia(0.3) hue-rotate(-30deg) contrast(1.1)'
  },
  'peur': {
    text: "Allons, un peu de courage.",
    filter: 'brightness(0.9) blur(0.5px)'
  },
  'surprise': {
    text: "Oh ! C'est inattendu.",
    filter: 'contrast(1.1)'
  },
  'dégoût': {
    text: "C'est... particulier.",
    filter: 'grayscale(0.5) hue-rotate(90deg)'
  },
  'enthousiasme': {
    text: "Splendide !",
    filter: 'saturate(1.2) brightness(1.1)'
  },
  'frustration': {
    text: "La patience est une vertu.",
    filter: 'contrast(1.2)'
  }
};

export function BackgroundImageResponsive() {
  const pathname = usePathname();
  const { isOpen } = useSidebar();
  const isDesktop = useIsDesktop();
  const { currentEmotion } = useChatContext();

  // Afficher l'image uniquement sur la page de chat et en mode desktop
  // Note: La route principale est maintenant /main, donc on vérifie si on est sur /main
  if (pathname !== '/main' || !isDesktop) {
    return null;
  }

  // Déterminer la config en fonction de l'émotion
  const emotionKey = currentEmotion?.emotion?.toLowerCase();
  const config = (emotionKey && EMOTION_MAP[emotionKey]) || null;
  
  // Style dynamique pour l'image
  const imageStyle = {
    objectFit: 'contain' as const,
    objectPosition: 'left center',
    filter: config?.filter || 'none',
    transition: 'filter 1s ease-in-out'
  };

  return (
    <div 
      className={`fixed pointer-events-none z-0 transition-all duration-500 ease-in-out ${
        isOpen ? 'left-64' : 'left-16'
      } top-16 bottom-0 w-[40%]`}
    >
      <div className="relative w-full h-full">
        {/* Bulle de dialogue - affichée seulement si une émotion spécifique est détectée */}
        {config && (
          <div className="absolute top-[15%] left-[55%] z-10 animate-bounce-slow max-w-[220px]">
            <div className="bg-white/95 backdrop-blur-sm border border-gray-200 p-4 rounded-2xl shadow-xl text-sm text-gray-800 font-serif italic relative">
              {config.text}
              {/* Triangle de la bulle - pointe vers la gauche (vers Bertrand) */}
              <div className="absolute top-6 -left-2 w-4 h-4 bg-white border-b border-l border-gray-200 transform rotate-45"></div>
            </div>
          </div>
        )}

        <Image 
          src="/bertrand.png" 
          alt="Bertrand - Votre majordome personnel" 
          fill
          style={imageStyle}
          priority
          className="drop-shadow-2xl opacity-75 transition-all duration-700"
          sizes="40vw"
        />
      </div>
    </div>
  );
}

