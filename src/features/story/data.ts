import { StoryLevel } from './types';

export const INITIAL_STORY_LEVELS: StoryLevel[] = [
  {
    id: 'default-hermione',
    title: "Bibliothèque de Poudlard - Hermione",
    description: "Hermione Granger est désespérée et envisage de quitter Poudlard. Parvenez à lui redonner espoir.",
    status: 'unlocked',
    order: 1,
    content: {
      character: "Hermione Granger",
      initial_message: "Je... je ne sais pas ce que je fais encore ici. Tout semble si vain. Je pense que je vais faire mes valises ce soir.",
      initial_mood: "sad",
      suggested_actions: [
        "Saluer doucement",
        "Demander de l'aide pour un sort",
        "S'asseoir en silence",
        "Lui demander ce qui ne va pas"
      ],
      context: "Vous êtes dans la bibliothèque de Poudlard. Hermione Granger, normalement brillante et optimiste, semble au bord des larmes, entourée de livres. Elle envisage sérieusement de quitter l'école.",
      goal: "Redonner espoir à Hermione et la convaincre de rester à Poudlard.",
      character_personality: "Hermione est intelligente, studieuse mais actuellement désespérée. Elle est sensible aux arguments logiques et à l'empathie."
    }
  }
];
