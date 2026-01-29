# 📁 Structure du Projet - Le Grimoire Éveillé

Date de dernière mise à jour: 2026-01-26

## 🎯 Vue d'Ensemble

Projet Next.js 14+ avec App Router, TypeScript, Supabase, et OpenAI.

---

## 📂 Structure des Dossiers

```
/home/nylorion/stage/my-app/
│
├── .vscode/                    # Configuration VS Code
│   └── settings.json
│
├── database/                   # Scripts et seeds SQL
│   ├── README.md              # Documentation database
│   └── seed.sql               # Données d'initialisation
│
├── docs/                       # 📚 Documentation centralisée
│   ├── backend/               # Documentation backend
│   │   ├── BACKEND_TODO.md   # Liste des tâches backend
│   │   └── CODE_REVIEW.md    # Revue de code
│   ├── CLERK_SETUP.md        # Guide setup Clerk
│   ├── CODE_STRUCTURE.md     # Structure du code
│   ├── DESIGN_THEMES_PROPOSALS.md
│   ├── FEATURES.md           # Liste des fonctionnalités
│   ├── RESPONSIVE_IMPROVEMENTS.md
│   ├── THEME_MINIMAL_IMPLEMENTED.md
│   └── UX_UI_IMPROVEMENTS.md
│
├── public/                     # Fichiers statiques
│   ├── favicon.png            # Favicon du site
│   ├── grimoire-logo.png      # Logo principal
│   └── characters/            # Images des personnages
│       ├── hermione/          # Images Hermione (5 moods)
│       ├── hagrid/            # Images Hagrid (5 moods)
│       └── PERSONNAGES_GUIDE.md
│
├── src/                        # Code source
│   │
│   ├── actions/               # 🎬 Server Actions Next.js
│   │   ├── game-actions.ts   # Actions de jeu (playTurn)
│   │   └── progression-actions.ts # Progression utilisateur
│   │
│   ├── app/                   # 📱 App Router Next.js
│   │   ├── admin/            # Pages d'administration
│   │   │   └── levels/
│   │   │       └── new/
│   │   │           └── page.tsx # Créer un niveau
│   │   ├── api/              # API Routes
│   │   │   └── levels/
│   │   │       └── route.ts  # CRUD niveaux
│   │   ├── immersive/        # Pages du jeu
│   │   │   ├── immersive-rpg/
│   │   │   │   └── page.tsx  # Page principale du jeu
│   │   │   └── layout.tsx
│   │   ├── themes/           # Thèmes CSS
│   │   │   └── minimal.css
│   │   ├── favicon.ico
│   │   ├── globals.css       # Styles globaux
│   │   ├── layout.tsx        # Layout racine
│   │   ├── page.tsx          # Page d'accueil (redirect)
│   │   └── providers.tsx     # Providers React
│   │
│   ├── components/            # 🧩 Composants React
│   │   ├── ui/               # Composants UI réutilisables
│   │   │   ├── Button.tsx
│   │   │   ├── CopyButton.tsx
│   │   │   ├── GrimoireLogo.tsx # Logo du projet
│   │   │   ├── Input.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── Snackbar.tsx
│   │   │   ├── TextArea.tsx
│   │   │   └── ThemeProvider.tsx
│   │   ├── NavbarResponsive.tsx # Navigation responsive
│   │   └── Sidebar.tsx          # Sidebar principale
│   │
│   ├── context/               # ⚛️ React Contexts
│   │   └── LanguageContext.tsx # Gestion i18n (FR/EN)
│   │
│   ├── features/              # 🎯 Fonctionnalités métier
│   │   └── story/            # Système de story/niveaux
│   │       ├── data.ts       # Niveaux par défaut
│   │       ├── StoryProgress.tsx # Composant progression
│   │       ├── types.ts      # Types TypeScript
│   │       └── useStoryProgression.ts # Hook custom
│   │
│   ├── hooks/                 # 🪝 Custom Hooks
│   │   ├── useMediaQuery.ts  # Hook responsive
│   │   ├── useSidebar.tsx    # Hook sidebar
│   │   └── useSnackbar.ts    # Hook notifications
│   │
│   ├── lib/                   # 🛠️ Utilitaires & Config
│   │   ├── validations/      # Schémas de validation
│   │   │   └── level.ts      # Validation des niveaux
│   │   ├── proxy.ts          # Proxy configuration
│   │   └── supabase.ts       # Client Supabase
│   │
│   └── types/                 # 📝 Types TypeScript globaux
│       └── index.ts
│
├── .gitignore
├── eslint.config.mjs          # Configuration ESLint
├── next.config.ts             # Configuration Next.js
├── package.json               # Dépendances npm
├── pnpm-lock.yaml             # Lock file pnpm
├── postcss.config.mjs         # Configuration PostCSS
├── README.md                  # Documentation principale
└── tsconfig.json              # Configuration TypeScript
```

---

## 🎨 Conventions de Nommage

### Fichiers et Dossiers

| Type | Convention | Exemple |
|------|-----------|---------|
| **Composants React** | `PascalCase.tsx` | `Button.tsx`, `NavbarResponsive.tsx` |
| **Hooks** | `useCamelCase.ts` | `useSnackbar.ts`, `useMediaQuery.ts` |
| **Utilitaires** | `camelCase.ts` | `supabase.ts`, `proxy.ts` |
| **Server Actions** | `kebab-case-actions.ts` | `game-actions.ts`, `progression-actions.ts` |
| **API Routes** | `route.ts` | Dans dossier nommé |
| **Types** | `types.ts` ou `index.ts` | `types.ts` |
| **Pages Next.js** | `page.tsx` | Dans App Router |
| **Layouts** | `layout.tsx` | Dans App Router |

### Variables et Fonctions

```typescript
// Constantes
const API_KEY = "...";
const MAX_RETRIES = 3;

// Variables
let userName = "John";
const isActive = true;

// Fonctions
function getUserName() {}
const handleClick = () => {};

// Composants
export function Button() {}
export const NavbarResponsive = () => {};

// Types
interface User {}
type Status = 'active' | 'inactive';
```

---

## 🗂️ Organisation par Fonctionnalité

### Fonctionnalité: Jeu de Rôle

```
Fichiers impliqués:
- /src/app/immersive/immersive-rpg/page.tsx (UI)
- /src/actions/game-actions.ts (Logique)
- /src/features/story/ (Gestion niveaux)
- /src/types/index.ts (Types GameState, ChatMessage)
```

### Fonctionnalité: Administration

```
Fichiers impliqués:
- /src/app/admin/levels/new/page.tsx (UI)
- /src/app/api/levels/route.ts (API)
- /src/lib/validations/level.ts (Validation)
```

### Fonctionnalité: Internationalisation

```
Fichiers impliqués:
- /src/context/LanguageContext.tsx (Context + traductions)
- Utilisation: t('key') dans tous les composants
```

---

## 📊 Flux de Données

### Jeu de Rôle

```
User Input (page.tsx)
    ↓
playTurn() (game-actions.ts)
    ↓
OpenAI API
    ↓
GameState mise à jour
    ↓
UI re-render
```

### Progression

```
completeLevel() (progression-actions.ts)
    ↓
Supabase user_level_progress
    ↓
fetchUserProgression()
    ↓
useStoryProgression hook
    ↓
StoryProgress component
```

---

## 🔑 Fichiers Clés

### Configuration

- `tsconfig.json` - TypeScript
- `next.config.ts` - Next.js
- `eslint.config.mjs` - Linting
- `package.json` - Dépendances

### Core Business Logic

- `src/actions/game-actions.ts` - Logique IA du jeu
- `src/actions/progression-actions.ts` - Gestion progression
- `src/features/story/useStoryProgression.ts` - Hook principal

### UI Principal

- `src/app/immersive/immersive-rpg/page.tsx` - Page de jeu
- `src/components/Sidebar.tsx` - Navigation
- `src/components/NavbarResponsive.tsx` - Header

---

## 🚀 Points d'Entrée

### Développement

```bash
npm run dev           # Lance le serveur de dev
npm run build         # Build production
npm run lint          # Vérifier le code
```

### URLs Principales

- `/` - Redirect vers le jeu
- `/immersive/immersive-rpg` - Jeu principal
- `/admin/levels/new` - Créer un niveau

---

## 📦 Dépendances Principales

### Production

- **Next.js 15** - Framework React
- **React 19** - UI Library
- **TypeScript** - Type safety
- **Supabase** - Database (PostgreSQL)
- **OpenAI** - IA conversationnelle
- **Clerk** - Authentification
- **TailwindCSS** - Styling
- **React Query** - State management
- **Zod** - Validation

### Développement

- **ESLint** - Linting
- **TypeScript** - Type checking

---

## 🎯 Prochaines Améliorations

Voir `/docs/backend/BACKEND_TODO.md` pour la liste complète des tâches backend restantes.

### Quick Wins

1. Rate Limiting
2. RLS Supabase
3. Error Handling amélioré
4. Tests automatisés

---

## 📝 Notes

- **Pas de fichiers unused** - Projet nettoyé régulièrement
- **Documentation à jour** - Toute dans `/docs`
- **Conventions strictes** - Respectées partout
- **Type-safe** - TypeScript strict mode

---

## 🤝 Contributing

Avant de contribuer:

1. Lire cette documentation
2. Respecter les conventions de nommage
3. Ajouter des types TypeScript
4. Tester le code
5. Mettre à jour la doc si nécessaire

---

**Dernière révision:** 2026-01-26  
**Version:** 2.0  
**Mainteneur:** Équipe Le Grimoire Éveillé
