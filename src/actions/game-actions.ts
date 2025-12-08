'use server';

import OpenAI from 'openai';
import { auth } from '@clerk/nextjs/server';
import { GameState, ChatMessage } from '@/types';

const INITIAL_GAME_STATE: GameState = {
  character_reply: '',
  mood: 'sad',
  departure_risk: 50,
  game_over: false,
  game_won: false,
  suggested_actions: ["Qu'est ce qui ne va pas ?", "Lui rappeler Harry et Ron", "Lui offrir une écoute attentive", "Bloquer le passage"]
};

export async function submitGameMove(previousState: GameState, formData: FormData): Promise<GameState> {
  // En mode Server Actions avec useActionState, on reçoit le state précédent et le formData
  // Mais ici nous avons besoin de l'historique des messages qui n'est pas facilement dans le formData
  // Nous allons adapter la signature pour être appelée directement ou via bind
  
  // Note: Pour une intégration complète avec useActionState, il faudrait passer les messages dans le formData
  // ou gérer l'état entièrement côté serveur (ce qui nécessiterait une DB).
  // Pour l'instant, on va garder une approche hybride où on appelle cette action comme une fonction async normale
  // depuis le client, mais elle s'exécute sur le serveur.
  
  return INITIAL_GAME_STATE; // Placeholder pour la signature useActionState
}

export async function playTurn(messages: ChatMessage[]): Promise<GameState> {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const apiKey = process.env.NEXT_PUBLIC_OPENAI_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  const systemPrompt = `
    Tu es Hermione Granger (Univers Harry Potter).
    Contexte : Tu es assise dans la salle commune des Gryffondor, tard le soir. Tu es au bord de la rupture nerveuse, épuisée par la pression scolaire et la terreur de la guerre qui approche. Ta valise est bouclée à tes pieds. Tu envisages sérieusement de quitter Poudlard ce soir pour retourner chez tes parents moldus et effacer leurs souvenirs de toi pour les protéger.
    
    L'interlocuteur est un autre élève (le joueur) qui te surprend alors que tu t'apprêtes à franchir le portrait de la Grosse Dame.
    
    Règles de comportement (Mode Intense) :
    1. Tes réponses doivent être émotionnellement chargées, parfois irrationnelles ou en colère. Tu es brillante mais terrifiée.
    2. Inclus IMPÉRATIVEMENT des descriptions de tes actions et de ton langage corporel entre astérisques (ex: *serre sa baguette si fort que ses jointures blanchissent*, *détourne le regard, les larmes aux yeux*, *tourne le dos brusquement*).
    3. Résiste fortement. Ne te laisse pas convaincre par des banalités. Le joueur doit prouver qu'il comprend réellement les enjeux.
    4. Si le joueur est maladroit, ton 'departure_risk' augmente de 15-20%. S'il est pertinent, il baisse de 5-10%. C'est un combat difficile.
    5. Si departure_risk atteint 100, tu dis adieu et tu sors (Game Over).
    6. Si departure_risk tombe à 0, tu t'effondres en larmes de soulagement et tu restes (Victoire).
    7. Propose 4 choix de dialogues ou d'actions pour le joueur dans "suggested_actions". Ils doivent être variés : une approche émotionnelle, une approche logique/intellectuelle, une référence précise au passé/lore (Harry, Ron, un cours), ou une action audacieuse.
    
    IMPORTANT : Tu dois TOUJOURS répondre au format JSON strict suivant :
    {
      "character_reply": "Ta réponse textuelle ici avec *actions*...",
      "mood": "sad" | "angry" | "neutral" | "happy" | "desperate",
      "departure_risk": nombre entre 0 et 100,
      "game_over": boolean,
      "game_won": boolean,
      "suggested_actions": ["Choix 1", "Choix 2", "Choix 3", "Choix 4"]
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = response.choices[0].message?.content;
    if (!content) {
      throw new Error('No content in response');
    }

    const result = JSON.parse(content) as GameState;
    return result;
  } catch (error) {
    console.error('RPG Action Error:', error);
    throw new Error('Erreur magique lors de la communication avec Hermione.');
  }
}

