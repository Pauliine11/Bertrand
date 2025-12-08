import { StoryLevel } from './types';

export const INITIAL_STORY_LEVELS: StoryLevel[] = [
  {
    id: 'chap-1-bibliotheque',
    title: "Chapitre 1 : Rencontre à la Bibliothèque",
    description: "Saluez Hermione Granger qui révise à la bibliothèque. Ne faites pas trop de bruit !",
    status: 'unlocked',
    order: 1
  },
  {
    id: 'chap-2-wingardium',
    title: "Chapitre 2 : La Plume qui Lévite",
    description: "Demandez à Hermione de vous apprendre le sortilège de Lévitation (Wingardium Leviosa).",
    status: 'locked',
    order: 2
  },
  {
    id: 'chap-3-ecoute',
    title: "Chapitre 3 : Une Oreille Attentive",
    description: "Hermione semble stressée. Offrez-lui une écoute attentive pour la calmer.",
    status: 'locked',
    order: 3
  },
  {
    id: 'chap-4-retourneur',
    title: "Chapitre 4 : Le Secret du Temps",
    description: "Essayez de convaincre Hermione de vous parler de son emploi du temps impossible.",
    status: 'locked',
    order: 4
  },
  {
    id: 'chap-5-espoir',
    title: "Chapitre 5 : Lueur d'Espoir",
    description: "Réussissez à faire sourire Hermione ou à lui redonner espoir (Victoire).",
    status: 'locked',
    order: 5
  }
];
