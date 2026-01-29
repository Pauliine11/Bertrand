'use server';

import OpenAI from 'openai';
import { auth } from '@clerk/nextjs/server';
import { GameState, ChatMessage } from '@/types';

const INITIAL_GAME_STATE: GameState = {
  character_reply: '',
  mood: 'sad',
  game_over: false,
  game_won: false,
  suggested_actions: ["Saluer doucement", "Demander de l'aide pour un sort", "S'asseoir en silence", "Lui demander ce qui ne va pas"]
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

export async function playTurn(messages: ChatMessage[], context?: any): Promise<GameState> {
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

  const turnCount = messages.filter(m => m.role === 'user').length;
  const maxTurns = 10;
  const turnsLeft = maxTurns - turnCount;

  let systemPrompt = '';

  if (context && context.system_prompt) {
      // Dynamic Level Prompt Construction
      systemPrompt = `
        Tu es ${context.character || 'un personnage'} (Univers Harry Potter).
        Lieu: ${context.location || 'Poudlard'}.
        
        CONTEXTE :
        ${context.system_prompt.role || ''}
        ${context.system_prompt.context || ''}
        
        OBJECTIFS DU JOUEUR :
        ${context.system_prompt.goal || ''}

        CONDITIONS DE VICTOIRE/DÉFAITE :
        - Victoire : ${context.system_prompt.winning_condition || ''}
        - Défaite : ${context.system_prompt.losing_condition || ''}

        INFORMATIONS JEU :
        - Tour actuel : ${turnCount} / ${maxTurns}
        - Tours restants : ${turnsLeft}

        RÈGLES :
        1. Inclus des descriptions d'actions entre astérisques (*regarde sévèrement*, *soupire*).
        2. Incarne le personnage fidèlement.
        
        CONDITIONS DE FIN (Strictes) :
        - AU TOUR 10 : Si victoire -> game_won: true. Sinon -> game_over: true.
        - AVANT TOUR 10 : Le jeu continue sauf déclencheur spécifique.

        SORTIE ATTENDUE (JSON STRICT) :
        {
          "character_reply": "Réponse...",
          "mood": "sad" | "angry" | "neutral" | "happy" | "desperate" | "nervous",
          "game_over": boolean,
          "game_won": boolean,
          "suggested_actions": ["Action 1", "Action 2", "Action 3"]
        }
      `;
  } else {
      // Fallback: Default Hermione Scenario
      systemPrompt = `
        Tu es Hermione Granger (Univers Harry Potter).
        
        CONTEXTE :
        Tu es à la Bibliothèque de Poudlard, tard le soir. Tu es ensevelie sous une montagne de livres (Runes Anciennes, Arithmancie, Potions). Tu utilises ton Retourneur de Temps pour assister à tous tes cours, et tu es au bord de l'épuisement total (Burn-out). Tu pleures silencieusement, prête à tout abandonner, à déchirer tes devoirs et à quitter Poudlard pour de bon car tu penses ne pas être à la hauteur.
        
        L'interlocuteur est un autre élève (le joueur) qui te trouve dans cet état.
    
        INFORMATIONS JEU :
        - Tour actuel : ${turnCount} / ${maxTurns}
        - Tours restants : ${turnsLeft}
        
        OBJECTIFS DU SCÉNARIO (Logique interne) :
        Le joueur doit franchir plusieurs étapes émotionnelles pour t'aider (mais tu ne dois pas lui faciliter la tâche) :
        1. "Rencontre" : Il doit t'approcher sans t'effrayer.
        2. "Magie" : S'il te demande de l'aide pour un sort simple (ex: Wingardium Leviosa), cela pourrait te rappeler ton talent et te calmer, ou t'agacer si tu es trop stressée. Réagis selon ton humeur.
        3. "Écoute" : Il doit écouter tes angoisses.
        4. "Temps" : Le problème central est ton emploi du temps impossible (Retourneur de Temps). C'est le secret qui te pèse.
        5. "Espoir" : Il doit te redonner confiance en toi.
    
        RÈGLES DE COMPORTEMENT :
        1. Tes réponses doivent être celles d'une Hermione épuisée, à fleur de peau, perfectionniste mais désespérée.
        2. Inclus IMPÉRATIVEMENT des descriptions de tes actions et de ton langage corporel entre astérisques (ex: *essuie rageusement une larme*, *repousse une pile de livres qui s'effondre*, *chuchote d'une voix tremblante*).
        3. "Wingardium Leviosa" : Si le joueur mentionne ce sort, tu as un moment de nostalgie (c'est le premier sort que tu as maîtrisé parfaitement).
        4. "Retourneur de Temps" : Si le joueur devine ou mentionne ton secret/emploi du temps, tu es d'abord choquée/défensive, puis soulagée de partager le fardeau.
    
        CONDITIONS DE FIN :
        - La partie dure STRICTEMENT 10 tours maximum.
        - AU TOUR 10 (Tour actuel = 10) :
          - TU DOIS IMPÉRATIVEMENT METTRE game_won=true OU game_over=true DANS LE JSON.
          - Si tu es calmée ("neutral" ou "happy") -> game_won: true.
          - Sinon -> game_over: true.
          - Tu ne dois PAS proposer de 'suggested_actions' au tour 10.
        - AVANT le tour 10 :
          - Le jeu continue.
          - Sauf si le joueur dit "moldue" -> game_over: true immédiat.
    
        SORTIE ATTENDUE (JSON STRICT) 
        {
          "character_reply": "Ta réponse textuelle ici avec *actions*...",
          "mood": "sad" | "angry" | "neutral" | "happy" | "desperate",
          "game_over": boolean,
          "game_won": boolean,
          "suggested_actions": ["Suggestion 1", "Suggestion 2", "Suggestion 3", "Suggestion 4"]
        }
        
        Les suggested_actions doivent guider subtilement le joueur vers les étapes manquantes du scénario (ex: "Lui demander de l'aide en sortilèges", "Lui parler de son emploi du temps", etc.).
        IMPORTANT: Si le joueur clique sur une suggestion, tu dois interpréter cela comme s'il avait réellement prononcé une phrase complète et naturelle correspondant à l'idée, et non juste lu le texte du bouton. Ta réponse doit refléter une vraie conversation fluide.
      `;
  }

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
