# 🪄 Poudlard RPG - Jeu de Rôle Immersif

Application Next.js de jeu de rôle immersif dans l'univers d'Harry Potter, propulsée par l'IA OpenAI.

## ✨ Fonctionnalités

### **Jeu de Rôle** 🎭
- 🎮 **Scénarios Immersifs** - Interagissez avec les personnages de Poudlard
- 🧙 **Personnages Dynamiques** - Hermione, Hagrid, et bien d'autres
- 😊 **Système d'Émotions** - Les personnages réagissent selon vos actions
- 🎯 **Objectifs de Niveau** - Chaque niveau a un but à atteindre
- 📊 **Progression** - Suivez votre avancement dans le grimoire

### **Administration** 🛠️
- ➕ **Créer des Niveaux** - Interface intuitive pour créer de nouveaux scénarios
- 🎨 **Personnages Personnalisés** - Ajoutez vos propres personnages avec images
- 📝 **Configuration JSON** - Contrôle total sur le contenu des niveaux
- 🗄️ **Base de Données** - Stockage persistant avec Supabase

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ 
- npm ou pnpm
- Une clé API OpenAI
- Un compte Supabase (gratuit)

### Installation

1. **Cloner le repository**
```bash
git clone <your-repo-url>
cd my-app
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env.local` :
```env
# OpenAI
NEXT_PUBLIC_OPENAI_KEY=sk-your-actual-api-key-here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Clerk (Authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
CLERK_SECRET_KEY=your-clerk-secret
```

> 🔑 **Obtenir les clés :**
> - OpenAI: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
> - Supabase: [https://supabase.com](https://supabase.com)
> - Clerk: [https://clerk.com](https://clerk.com)

4. **Configurer la base de données**

Exécuter ces commandes SQL dans Supabase :

```sql
-- Table des niveaux
CREATE TABLE levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  content JSONB,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table de progression
CREATE TABLE user_level_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  level_id UUID REFERENCES levels(id),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, level_id)
);
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

6. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 📁 Structure du Projet

```
src/
├── app/
│   ├── immersive/immersive-rpg/  # Jeu de rôle principal
│   ├── admin/levels/new/         # Création de niveaux
│   └── api/                      # API routes
├── components/
│   ├── Sidebar.tsx               # Navigation
│   └── ui/                       # Composants UI
├── features/
│   └── story/                    # Logique du jeu
│       ├── useStoryProgression.ts
│       ├── StoryProgress.tsx
│       └── data.ts
├── actions/
│   ├── game-actions.ts           # Actions serveur du jeu
│   └── progression-actions.ts    # Progression utilisateur
└── lib/
    └── supabase.ts               # Client Supabase

public/
├── hermione/                     # Images Hermione
│   ├── neutral.jpg
│   ├── sad.jpg
│   ├── happy.jpg
│   ├── angry.jpg
│   └── desperate.jpg
├── hagrid/                       # Images Hagrid
│   └── ...
└── PERSONNAGES_GUIDE.md         # Guide des images
```

## 🎮 Guide d'Utilisation

### Jouer à un Niveau

1. Lancez l'application et accédez au **Jeu de Rôle**
2. Sélectionnez un niveau disponible
3. Interagissez avec le personnage via le chat
4. Les émotions du personnage changent selon vos réponses
5. Atteignez l'objectif pour compléter le niveau

### Créer un Nouveau Niveau

1. Allez dans **Admin** > **Créer des niveaux**
2. Remplissez les informations :
   - **Titre** : Nom du niveau
   - **Description** : Brève description
   - **Ordre** : Position dans la liste
   - **Contenu (JSON)** : Configuration du niveau

Exemple de contenu JSON :
```json
{
  "character": "Hagrid",
  "initial_message": "Bonjour ! Bienvenue dans ma cabane...",
  "initial_mood": "happy",
  "suggested_actions": [
    "Saluer Hagrid",
    "Demander des informations",
    "Parler des créatures magiques"
  ],
  "context": "Hagrid est dans sa cabane...",
  "goal": "Découvrir le secret de la cabane",
  "character_personality": "Hagrid est gentil mais mystérieux..."
}
```

3. Cliquez sur **Créer le niveau**

### Ajouter un Nouveau Personnage

1. Créez un dossier dans `/public/` avec le prénom du personnage :
   ```
   /public/draco/
   ```

2. Ajoutez 5 images JPG :
   - `neutral.jpg` (Expression neutre)
   - `sad.jpg` (Triste)
   - `happy.jpg` (Joyeux)
   - `angry.jpg` (En colère)
   - `desperate.jpg` (Désespéré)

3. Créez un niveau avec ce personnage dans l'Admin

4. Le système chargera automatiquement les images ! 🎨

Plus de détails : voir [PERSONNAGES_GUIDE.md](./public/PERSONNAGES_GUIDE.md)

## 🎨 Technologies

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles
- **OpenAI API** - IA conversationnelle
- **Supabase** - Base de données PostgreSQL
- **Clerk** - Authentification
- **React Query** - Gestion d'état
- **Zod** - Validation de formulaires

## 📚 Documentation

- [FEATURES.md](./documentation/FEATURES.md) - Fonctionnalités détaillées
- [PERSONNAGES_GUIDE.md](./public/PERSONNAGES_GUIDE.md) - Guide des images
- [CODE_STRUCTURE.md](./documentation/CODE_STRUCTURE.md) - Architecture

## 🐛 Problèmes Courants

### Images ne s'affichent pas
→ Vérifiez que les images existent dans `/public/[personnage]/` avec les bons noms

### Niveau en double
→ Supprimez le doublon dans Supabase avec :
```sql
DELETE FROM levels WHERE id = 'id-du-doublon';
```

### "Could not find the 'content' column"
→ Ajoutez la colonne dans Supabase :
```sql
ALTER TABLE levels ADD COLUMN IF NOT EXISTS content JSONB;
```

## 🔒 Sécurité

⚠️ **Ne JAMAIS commiter :**
- `.env.local` (vos clés API)
- Fichiers contenant des secrets

Avant de push :
```bash
git check-ignore .env.local
# Devrait afficher: .env.local
```

## 🛠️ Scripts Disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint
```

## 🎯 Roadmap

- [ ] Plus de personnages par défaut
- [ ] Système de points/récompenses
- [ ] Mode multijoueur
- [ ] Générateur de niveaux assisté par IA
- [ ] Sons et musique d'ambiance

## 📄 Licence

Ce projet est sous licence MIT.

---

**Fait avec 🪄 et beaucoup de ☕**
