export interface GameState {
  character_reply: string;
  mood: 'sad' | 'angry' | 'neutral' | 'happy' | 'desperate';
  game_over: boolean;
  game_won: boolean;
  suggested_actions?: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

