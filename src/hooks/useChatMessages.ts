'use client';

import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { OpenAIService } from '@/services/openai.service';

export function useChatMessages() {
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

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: newText,
        },
      ]);

      scrollToLastMessage();
    },
    onError: (error) => {
      console.error('OpenAI API Error:', error);
      throw error; // Re-throw pour que le composant puisse gérer l'erreur
    },
  });

  const scrollToLastMessage = () => {
    setTimeout(() => {
      ref.current?.children[ref.current?.children.length - 1].scrollIntoView();
    }, 1);
  };

  const sendMessage = (content: string) => {
    const newMessage: ChatCompletionMessageParam = {
      role: 'user',
      content,
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    scrollToLastMessage();
    
    mutation.mutate(newMessages);
  };

  return {
    messages,
    ref,
    sendMessage,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

