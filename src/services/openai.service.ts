import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

export class OpenAIService {
  private static getApiKey(): string {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_KEY;
    
    if (!apiKey || apiKey === 'your-api-key-here') {
      throw new Error('OpenAI API key is not configured. Please add your API key to .env.local');
    }
    
    return apiKey;
  }

  static async createChatCompletion(messages: ChatCompletionMessageParam[]) {
    const apiKey = this.getApiKey();
    
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });

    return await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });
  }
}

