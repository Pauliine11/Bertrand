# 📁 Structure du Code - Bertrand App

## 🎯 Architecture Organisée

Le code a été refactorisé pour suivre les meilleures pratiques React/Next.js avec une séparation claire des responsabilités.

---

## 📂 Structure des Dossiers

```
src/
├── app/                                  # Pages Next.js (App Router)
│   ├── layout.tsx                       # Layout racine avec Navbar
│   ├── page.tsx                         # Page d'accueil (Chat)
│   ├── bertrand-editor-space/
│   │   └── page.tsx                     # Page Éditeur + Chat
│   └── globals.css                      # Styles globaux
│
├── components/                           # Composants réutilisables
│   ├── Navbar.tsx                       # Navigation principale
│   ├── BertrandLogo.tsx                 # Logo SVG de Bertrand
│   ├── Snackbar.tsx                     # Notifications toast
│   ├── Loader.tsx                       # Indicateur de chargement
│   ├── Message.tsx                      # Message de chat
│   └── TextArea.tsx                     # Champ de texte personnalisé
│
├── hooks/                                # Hooks personnalisés React
│   ├── useChatMessages.ts               # Logique du chat OpenAI
│   ├── useChatWithDraft.ts              # Chat avec support du mode Draft
│   ├── useVersionHistory.ts             # Gestion du versioning
│   ├── useSnackbar.ts                   # Gestion des notifications
│   ├── useAutoSave.ts                   # Auto-sauvegarde avec debounce
│   ├── useDraftMode.ts                  # Gestion du mode Draft
│   └── useChat.ts                       # Hook chat alternatif (API route)
│
└── services/                             # Services & logique métier
    └── openai.service.ts                # Service OpenAI centralisé
```

---

## 🔧 Hooks Personnalisés

### 1. **useChatMessages**
Gère toute la logique de chat avec OpenAI.

```typescript
const { messages, ref, sendMessage, isLoading, error } = useChatMessages();
```

**Responsabilités:**
- État des messages
- Appel à l'API OpenAI
- Défilement automatique
- Gestion des erreurs

---

### 2. **useVersionHistory**
Gère le système de versioning du Markdown.

```typescript
const {
  value,
  setValue,
  versionHistory,
  currentVersionIndex,
  hasUnsavedChanges,
  saveVersion,
  goToPreviousVersion,
  goToNextVersion,
  deleteCurrentVersion,
} = useVersionHistory("**Hello world!!!**");
```

**Responsabilités:**
- Gestion de l'historique des versions
- Navigation entre versions
- Détection des changements non sauvegardés
- Suppression de versions

---

### 3. **useSnackbar**
Gère l'affichage des notifications.

```typescript
const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
```

**Responsabilités:**
- État de la snackbar
- Affichage temporisé (3 secondes)
- Types: success, error, info

---

### 4. **useAutoSave**
Gère la sauvegarde automatique avec debounce.

```typescript
const { isSaving } = useAutoSave({
  value,
  onSave: handleAutoSave,
  delay: 2000,
  enabled: hasUnsavedChanges,
});
```

**Responsabilités:**
- Debounce (évite de sauvegarder à chaque frappe)
- Délai configurable
- Peut être activé/désactivé

---

### 5. **useDraftMode**
Gère le mode "Draft" pour modifier le document via l'IA.

```typescript
const { isDraftMode, toggleDraftMode, formatMessageWithContext } = useDraftMode();
```

**Responsabilités:**
- État du mode Draft (activé/désactivé)
- Formatage des messages avec contexte de l'éditeur
- Toggle du mode

---

### 6. **useChatWithDraft**
Version du chat qui supporte le mode Draft.

```typescript
const { messages, sendMessage, isLoading } = useChatWithDraft({
  isDraftMode,
  onDraftResponse: (content) => setValue(content),
});
```

**Responsabilités:**
- Chat normal ou mode Draft selon l'état
- Redirection des réponses vers l'éditeur en mode Draft
- Gestion du contexte automatique

---

## 🎨 Composants Réutilisables

### **Snackbar**
Notification toast élégante pour les feedbacks utilisateur.

```tsx
<Snackbar 
  open={true}
  message="Sauvegarde réussie !"
  type="success"
/>
```

### **BertrandLogo**
Logo SVG vectoriel de Bertrand (majordome raffiné).

```tsx
<BertrandLogo className="h-12 w-12" />
```

### **DraftModeToggle**
Bouton pour activer/désactiver le mode Draft.

```tsx
<DraftModeToggle 
  isDraftMode={isDraftMode}
  onToggle={toggleDraftMode}
/>
```

---

## 🔌 Services

### **OpenAIService**
Service centralisé pour les appels à l'API OpenAI.

```typescript
OpenAIService.createChatCompletion(messages);
```

**Avantages:**
- Configuration centralisée
- Gestion des erreurs uniforme
- Validation de la clé API
- Facile à tester / mocker

---

## ✅ Avantages de cette Architecture

### 1. **Séparation des Responsabilités**
- Chaque hook a une responsabilité unique
- Les composants sont plus simples
- Le code est plus testable

### 2. **Réutilisabilité**
- Les hooks peuvent être utilisés dans plusieurs pages
- Les composants sont modulaires
- Facile d'ajouter de nouvelles fonctionnalités

### 3. **Maintenabilité**
- Code organisé et facile à trouver
- Moins de duplication
- Plus facile à déboguer

### 4. **Performance**
- Hooks optimisés avec `useCallback` et `useMemo`
- Pas de re-renders inutiles
- Auto-save avec debounce

---

## 🚀 Exemple d'Utilisation

### Page Simple (Chat uniquement)
```tsx
import { useChatMessages } from '@/hooks/useChatMessages';

export default function ChatPage() {
  const { messages, sendMessage, isLoading } = useChatMessages();
  
  return (
    <div>
      {/* Votre UI */}
    </div>
  );
}
```

### Page Complète (Éditeur + Chat)
```tsx
import { useChatMessages } from '@/hooks/useChatMessages';
import { useVersionHistory } from '@/hooks/useVersionHistory';
import { useSnackbar } from '@/hooks/useSnackbar';

export default function EditorPage() {
  const chat = useChatMessages();
  const editor = useVersionHistory("**Initial**");
  const { showSnackbar } = useSnackbar();
  
  // Logique combinée...
}
```

---

## 📝 Notes Importantes

1. **Pas de duplication de code OpenAI**
   - Tout passe par `OpenAIService`
   - Configuration centralisée

2. **Hooks testables**
   - Chaque hook peut être testé indépendamment
   - Mock des services facilité

3. **TypeScript strict**
   - Types définis pour tout
   - Interfaces claires

4. **Performance**
   - Optimisations React (useCallback, useMemo)
   - Lazy loading possible

---

## ✨ Mode Draft - Fonctionnalité Avancée

Le **Mode Draft** permet à l'IA de modifier directement le contenu de l'éditeur Markdown.

### Comment ça fonctionne ?

#### 1. **Activation**
Cliquez sur le bouton "📝 Mode Draft" au-dessus du chat.
- Le bouton devient doré et animé : ✨ Mode Draft
- Un bandeau informatif apparaît dans le chat

#### 2. **Comportement en Mode Draft**

**Contexte automatique:**
```
Voici le contenu de mon document : 

{contenu de l'éditeur}

Voici la demande de l'utilisateur : {votre message}
```

**Flux de traitement:**
1. Vous tapez : "Corrige les fautes"
2. Le système envoie à l'IA : le contenu + votre demande
3. La réponse de l'IA remplace le contenu de l'éditeur
4. Une notification confirme la modification

**Différences avec le mode normal:**
| Aspect | Mode Normal | Mode Draft |
|--------|-------------|------------|
| Message utilisateur | Affiché dans le chat | Non affiché |
| Réponse IA | Affichée dans le chat | Remplace l'éditeur |
| Contexte | Historique du chat | Contenu de l'éditeur |
| Usage | Conversation | Modification de document |

#### 3. **Cas d'usage**

**Correction et amélioration:**
- "Corrige les fautes d'orthographe"
- "Améliore le style"
- "Rends ce texte plus professionnel"

**Traduction:**
- "Traduis en anglais"
- "Traduis en espagnol"

**Transformation:**
- "Résume ce texte"
- "Développe cette idée"
- "Convertis en liste à puces"

**Formatage:**
- "Ajoute des titres Markdown"
- "Formate en tableau"
- "Ajoute des emojis pertinents"

#### 4. **Architecture Technique**

```typescript
// Hook useDraftMode
const { 
  isDraftMode,           // État du mode
  toggleDraftMode,       // Activer/désactiver
  formatMessageWithContext // Ajouter le contexte
} = useDraftMode();

// Hook useChatWithDraft
const { messages, sendMessage } = useChatWithDraft({
  isDraftMode,
  onDraftResponse: (content) => {
    setValue(content);  // Remplacer le contenu
  }
});
```

#### 5. **Indicateurs Visuels**

- 🟡 **Bouton doré animé** : Mode activé
- 📋 **Bandeau informatif** : Explications contextuelles
- ✨ **Label modifié** : "Votre instruction pour modifier le document"
- 🌟 **Bouton d'envoi doré** : "✨ Modifier le document"
- 🔴 **Point rouge** : Changements non sauvegardés après modification

---

## 🔮 Évolutions Futures Possibles

- [ ] Ajouter des tests unitaires pour les hooks
- [ ] Créer une API route `/api/chat` pour sécuriser la clé OpenAI
- [ ] Ajouter un système de persistence (localStorage, DB)
- [ ] Implémenter un système d'undo/redo
- [ ] Ajouter un mode hors ligne
- [ ] Créer un composant de comparaison de versions

---

**Date de refactoring:** 2025-11-26  
**Version:** 2.0

