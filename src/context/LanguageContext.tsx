'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  fr: {
    // Navbar
    'nav.title': 'Le Grimoire Éveillé',
    'nav.titleShort': 'Grimoire',
    
    // Sidebar
    'sidebar.rpg': 'Jeu de Rôle',
    'sidebar.admin': 'Admin',
    'sidebar.tip.title': 'Astuce',
    'sidebar.tip.content': 'Créez vos propres aventures avec différents personnages dans l\'Admin',
    'sidebar.footer.powered': 'Propulsé par OpenAI',
    'sidebar.footer.version': 'v2.0',
    
    // RPG Game - Level Selection
    'rpg.selectTitle': 'Choisissez votre aventure',
    'rpg.selectSubtitle': 'Sélectionnez un niveau pour commencer votre histoire à Poudlard',
    'rpg.status.completed': 'Complété',
    'rpg.status.available': 'Disponible',
    'rpg.status.locked': 'Verrouillé',
    'rpg.character': 'Personnage',
    'rpg.emptyTitle': 'Aucun niveau disponible',
    'rpg.emptySubtitle': 'Créez votre premier niveau dans la section Admin',
    
    // RPG Game - Game Screen
    'rpg.backToLevels': 'Niveaux',
    'rpg.grimoire': 'Grimoire',
    'rpg.inputPlaceholder': 'Que dites-vous ?',
    'rpg.gameOver': 'Game Over',
    'rpg.victory': 'Victoire !',
    'rpg.gameOverText': 'La mission a échoué. Réessayez pour découvrir un autre chemin.',
    'rpg.victoryText': 'Vous avez accompli votre mission avec succès !',
    'rpg.backButton': 'Retour aux niveaux',
    
    // Admin
    'admin.title': 'Créer un Nouveau Niveau',
    'admin.subtitle': 'Ajoutez un nouveau chapitre à l\'histoire',
    'admin.backToHome': 'Retour à l\'accueil',
    'admin.form.titleLabel': 'Titre du Niveau',
    'admin.form.titlePlaceholder': 'Ex: Le Donjon Obscur',
    'admin.form.orderLabel': 'Ordre (Index)',
    'admin.form.orderPlaceholder': '1',
    'admin.form.statusLabel': 'Statut',
    'admin.form.activeCheckbox': 'Actif / Visible',
    'admin.form.descriptionLabel': 'Description',
    'admin.form.descriptionPlaceholder': 'Brève description du niveau...',
    'admin.form.contentLabel': 'Contenu (JSON)',
    'admin.form.contentPlaceholder': '{"character": "Hagrid", "initial_message": "..."}',
    'admin.form.contentHint': 'Configuration technique du niveau au format JSON',
    'admin.form.submitButton': 'Créer le Niveau',
    'admin.form.submitting': 'Création en cours...',
    'admin.success': 'Niveau créé avec succès !',
    
    // Story Progress
    'progress.title': 'Progression',
    
    // Default Level
    'level.hermione.title': 'Bibliothèque de Poudlard - Hermione',
    'level.hermione.description': 'Hermione Granger est désespérée et envisage de quitter Poudlard. Parvenez à lui redonner espoir.',
  },
  en: {
    // Navbar
    'nav.title': 'The Awakened Grimoire',
    'nav.titleShort': 'Grimoire',
    
    // Sidebar
    'sidebar.rpg': 'Role Playing',
    'sidebar.admin': 'Admin',
    'sidebar.tip.title': 'Tip',
    'sidebar.tip.content': 'Create your own adventures with different characters in the Admin section',
    'sidebar.footer.powered': 'Powered by OpenAI',
    'sidebar.footer.version': 'v2.0',
    
    // RPG Game - Level Selection
    'rpg.selectTitle': 'Choose Your Adventure',
    'rpg.selectSubtitle': 'Select a level to start your Hogwarts story',
    'rpg.status.completed': 'Completed',
    'rpg.status.available': 'Available',
    'rpg.status.locked': 'Locked',
    'rpg.character': 'Character',
    'rpg.emptyTitle': 'No levels available',
    'rpg.emptySubtitle': 'Create your first level in the Admin section',
    
    // RPG Game - Game Screen
    'rpg.backToLevels': 'Levels',
    'rpg.grimoire': 'Grimoire',
    'rpg.inputPlaceholder': 'What do you say?',
    'rpg.gameOver': 'Game Over',
    'rpg.victory': 'Victory!',
    'rpg.gameOverText': 'The mission failed. Try again to discover another path.',
    'rpg.victoryText': 'You have successfully completed your mission!',
    'rpg.backButton': 'Back to levels',
    
    // Admin
    'admin.title': 'Create a New Level',
    'admin.subtitle': 'Add a new chapter to the story',
    'admin.backToHome': 'Back to Home',
    'admin.form.titleLabel': 'Level Title',
    'admin.form.titlePlaceholder': 'Ex: The Dark Dungeon',
    'admin.form.orderLabel': 'Order (Index)',
    'admin.form.orderPlaceholder': '1',
    'admin.form.statusLabel': 'Status',
    'admin.form.activeCheckbox': 'Active / Visible',
    'admin.form.descriptionLabel': 'Description',
    'admin.form.descriptionPlaceholder': 'Brief level description...',
    'admin.form.contentLabel': 'Content (JSON)',
    'admin.form.contentPlaceholder': '{"character": "Hagrid", "initial_message": "..."}',
    'admin.form.contentHint': 'Technical level configuration in JSON format',
    'admin.form.submitButton': 'Create Level',
    'admin.form.submitting': 'Creating...',
    'admin.success': 'Level created successfully!',
    
    // Story Progress
    'progress.title': 'Progress',
    
    // Default Level
    'level.hermione.title': 'Hogwarts Library - Hermione',
    'level.hermione.description': 'Hermione Granger is desperate and considering leaving Hogwarts. Try to restore her hope.',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'fr' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['fr']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
