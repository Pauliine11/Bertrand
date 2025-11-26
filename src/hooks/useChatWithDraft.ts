'use client';

import { useState, useRef, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { OpenAIService } from '@/services/openai.service';

interface UseChatWithDraftOptions {
  isDraftMode: boolean;
  onDraftResponse: (content: string) => void;
}

export function useChatWithDraft({ isDraftMode, onDraftResponse }: UseChatWithDraftOptions) {
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const ref = useRef<HTMLUListElement>(null);

  const mutation = useMutation({
    mutationFn: (newMessages: ChatCompletionMessageParam[]) =>
      OpenAIService.createChatCompletion(newMessages),
    onSuccess: (response) => {
      const newText = response.choices[0].message?.content;

      if (!newText) {
        return;
      }

      // Si on est en mode draft, rediriger vers l'éditeur
      if (isDraftMode) {
        onDraftResponse(newText);
        // Ne pas ajouter au chat en mode draft
      } else {
        // Mode normal : ajouter au chat
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: 'assistant',
            content: newText,
          },
        ]);
        scrollToLastMessage();
      }
    },
    onError: (error) => {
      console.error('OpenAI API Error:', error);
      throw error;
    },
  });

  const scrollToLastMessage = () => {
    setTimeout(() => {
      ref.current?.children[ref.current?.children.length - 1].scrollIntoView();
    }, 1);
  };

  const sendMessage = useCallback((content: string) => {
    const newMessage: ChatCompletionMessageParam = {
      role: 'user',
      content,
    };

    const newMessages = [...messages, newMessage];
    
    // En mode draft, on n'affiche pas le message utilisateur dans le chat
    if (!isDraftMode) {
      setMessages(newMessages);
      scrollToLastMessage();
    }
    
    mutation.mutate(newMessages);
  }, [messages, isDraftMode, mutation]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    ref,
    sendMessage,
    clearMessages,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

