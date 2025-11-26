'use client';

import { useMutation } from '@tanstack/react-query';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { useState } from 'react';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([
    {
      role: 'system',
      content: 'You are a helpful assistant.',
    },
  ]);

  const mutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const newMessages: ChatCompletionMessageParam[] = [
        ...messages,
        { role: 'user', content: userMessage },
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response.json();
    },
    onSuccess: (data, userMessage) => {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: userMessage },
        data,
      ]);
    },
  });

  const sendMessage = (message: string) => {
    if (message.trim()) {
      mutation.mutate(message);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};

