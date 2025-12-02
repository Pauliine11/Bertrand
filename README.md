# 🎩 Bertrand - Votre Assistant IA Personnel

Application Next.js élégante avec éditeur Markdown et chat IA propulsé par OpenAI.

## ✨ Fonctionnalités

### **Core Features**
- 💬 **Chat IA** - Conversez avec Bertrand propulsé par GPT-3.5
- 📝 **Éditeur Markdown** - Éditeur avec prévisualisation en temps réel
- 🔄 **Versioning** - Historique complet avec navigation entre versions
- 💾 **Auto-save** - Sauvegarde automatique après 2 secondes d'inactivité
- ✨ **Mode Draft** - L'IA modifie directement votre document

### **UI/UX Enhancements** ⭐ NEW
- 🎛️ **Sidebar Collapsible** - Gagnez de l'espace (256px → 64px)
- ⚡ **Suggestions de Prompts** - Démarrez rapidement avec des templates
- 📋 **Copy to Clipboard** - Copiez les réponses en un clic
- ⌨️ **Raccourcis Clavier** - Productivité maximale (Ctrl+S, Ctrl+D, etc.)
- 🎨 **Interface élégante** - Design raffiné avec sidebar et navigation intelligente
- 📱 **Layout Responsive** - S'adapte automatiquement à vos besoins

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Une clé API OpenAI

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

Copier le fichier d'exemple :
```bash
cp .env.example .env.local
```

Éditer `.env.local` et ajouter votre clé API OpenAI :
```env
NEXT_PUBLIC_OPENAI_KEY=sk-your-actual-api-key-here
```

> 🔑 **Obtenir une clé API:** [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

4. **Lancer le serveur de développement**
```bash
npm run dev
```

5. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 📁 Structure du Projet

```
src/
├── app/                           # Pages Next.js (App Router)
│   ├── layout.tsx                # Layout racine avec Navbar
│   ├── page.tsx                  # Page d'accueil (Chat)
│   └── bertrand-editor-space/    # Page Éditeur + Chat
├── components/                    # Composants réutilisables
│   ├── Navbar.tsx               # Navigation
│   ├── BertrandLogo.tsx         # Logo SVG
│   ├── Snackbar.tsx             # Notifications
│   ├── DraftModeToggle.tsx      # Bouton Mode Draft
│   └── ...
├── hooks/                         # Hooks personnalisés
│   ├── useChatMessages.ts       # Logique chat
│   ├── useChatWithDraft.ts      # Chat avec mode Draft
│   ├── useVersionHistory.ts     # Versioning
│   ├── useDraftMode.ts          # Mode Draft
│   ├── useSnackbar.ts           # Notifications
│   └── useAutoSave.ts           # Auto-save
└── services/                      # Services
    └── openai.service.ts         # Service OpenAI
```

## 🎯 Fonctionnalités Détaillées

### Mode Chat
- Conversation avec l'IA
- Historique des messages
- Interface responsive

### Éditeur Markdown
- Édition en temps réel
- Prévisualisation instantanée
- Syntaxe Markdown complète

### Versioning
- Sauvegarde de chaque version
- Navigation entre versions (← →)
- Suppression de versions
- Timestamps automatiques

### Mode Draft ✨
Active un mode spécial où l'IA modifie directement votre document.

**Comment l'utiliser :**
1. Cliquez sur "📝 Mode Draft"
2. Le contenu de l'éditeur est automatiquement partagé avec l'IA
3. Tapez une instruction : "Corrige les fautes", "Traduis en anglais"...
4. La réponse remplace le contenu de l'éditeur

**Cas d'usage :**
- Correction orthographique
- Amélioration de style
- Traduction
- Reformatage
- Résumé/développement

Plus de détails : voir [DRAFT_MODE.md](./DRAFT_MODE.md)

## ⌨️ Raccourcis Clavier

Travaillez plus vite avec ces raccourcis :

| Raccourci | Action | Description |
|-----------|--------|-------------|
| `Ctrl/Cmd + S` | Sauvegarder | Sauvegarde et télécharge le document |
| `Ctrl/Cmd + D` | Toggle Draft | Active/désactive le Mode Draft |
| `Ctrl/Cmd + K` | Focus Chat | Place le curseur dans le champ de chat |

💡 Cliquez sur l'icône ⌨️ en bas à gauche pour voir tous les raccourcis disponibles.

## 🔒 Sécurité

### Variables d'Environnement

**✅ Fichiers ignorés par Git :**
- `.env.local` (votre clé API)
- `.env` 

**⚠️ Ne JAMAIS commiter :**
- Vos clés API
- `.env.local`
- Fichiers contenant des secrets

### Vérification avant Push

Avant de pousser sur GitHub :

```bash
# Vérifier qu'aucun fichier sensible n'est tracké
git status

# Vérifier le .gitignore
cat .gitignore

# S'assurer que .env.local est ignoré
git check-ignore .env.local
# Devrait afficher: .env.local
```

### Si vous avez déjà commit une clé

Si vous avez accidentellement commit votre clé API :

1. **Révoquer immédiatement la clé** sur [OpenAI](https://platform.openai.com/api-keys)
2. **Créer une nouvelle clé**
3. **Nettoyer l'historique Git :**
```bash
# Option 1: Supprimer le fichier de l'historique
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# Option 2: Utiliser git-filter-repo (recommandé)
git-filter-repo --path .env.local --invert-paths
```

4. **Force push** (attention : destructif)
```bash
git push origin --force --all
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

## 📚 Documentation

- [CODE_STRUCTURE.md](./CODE_STRUCTURE.md) - Architecture détaillée
- [DRAFT_MODE.md](./DRAFT_MODE.md) - Guide du Mode Draft

## 🎨 Technologies

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles
- **OpenAI API** - Intelligence artificielle
- **React Query** - Gestion d'état et requêtes
- **@uiw/react-md-editor** - Éditeur Markdown

## 🐛 Problèmes Courants

### "API Key not configured"
→ Vérifiez que `.env.local` existe et contient votre clé

### "Module not found"
→ Lancez `npm install`

### "Port already in use"
→ Changez le port : `PORT=3001 npm run dev`

### Erreur OpenAI
→ Vérifiez vos crédits sur [platform.openai.com](https://platform.openai.com)

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

Votre nom - [@votre-github](https://github.com/votre-username)

## 🙏 Remerciements

- OpenAI pour l'API GPT
- Next.js team
- La communauté open source

---

**Fait avec ❤️ et beaucoup de ☕**
