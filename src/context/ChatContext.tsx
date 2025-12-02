'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface EmotionAnalysis {
  emotion: string;
  valence: 'positive' | 'neutral' | 'negative';
  intensity: 'low' | 'medium' | 'high';
  confidence: number;
}

interface ChatContextType {
  currentEmotion: EmotionAnalysis | null;
  setCurrentEmotion: (emotion: EmotionAnalysis | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionAnalysis | null>(null);

  return (
    <ChatContext.Provider value={{ currentEmotion, setCurrentEmotion }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}

