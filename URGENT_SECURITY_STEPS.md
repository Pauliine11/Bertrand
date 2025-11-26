# 🚨 ACTIONS DE SÉCURITÉ URGENTES

## ⚠️ Problème Détecté

Votre fichier `.env` contenait votre clé API OpenAI et était tracké par Git.

## ✅ Actions Déjà Effectuées

1. ✓ Le fichier `.env` a été retiré du tracking Git
2. ✓ Les fichiers `.env.example`, `README.md` et `SECURITY.md` ont été créés
3. ✓ Les scripts de vérification ont été ajoutés à `package.json`

## 🔴 ACTIONS URGENTES À FAIRE MAINTENANT

### 1. RÉVOQUER votre clé API OpenAI (PRIORITÉ ABSOLUE)

**Pourquoi ?** Si vous avez déjà fait un `git push`, votre clé est publique sur GitHub.

**Comment faire :**
1. Aller sur : https://platform.openai.com/api-keys
2. Trouver votre clé actuelle
3. Cliquer sur "Delete" ou "Revoke"
4. Créer une **nouvelle clé**
5. Copier la nouvelle clé

### 2. Mettre à jour votre fichier .env.local

```bash
# Ouvrir le fichier
nano .env.local

# Remplacer l'ancienne clé par la NOUVELLE
NEXT_PUBLIC_OPENAI_KEY=votre-nouvelle-clé-ici
```

### 3. Vérifier que tout est ignoré

```bash
# Vérifier le statut
git status

# .env et .env.local ne doivent PAS apparaître
# Si ils apparaissent, c'est un problème
```

### 4. Vérifier l'historique Git

```bash
# Voir si .env a déjà été commit
git log --all --full-history -- .env

# Si vous voyez des commits, la clé a été dans l'historique !
```

### 5. Si la clé était dans l'historique ET que vous avez pushé

#### Option A : Repo privé ou pas encore pushé
```bash
# Commit les changements actuels
git add .
git commit -m "chore: remove .env from tracking and add security files"

# C'est bon, vous êtes sécurisé
```

#### Option B : Repo public ou déjà pushé avec la clé
```bash
# IMPORTANT : Révoquer d'abord la clé sur OpenAI !

# Ensuite, nettoyer l'historique Git
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (ATTENTION : destructif)
git push origin --force --all
git push origin --force --tags

# Dire à vos collaborateurs de re-cloner le repo
```

## ✅ Checklist de Sécurité

Avant de continuer :

- [ ] J'ai révoqué l'ancienne clé OpenAI
- [ ] J'ai créé une nouvelle clé OpenAI
- [ ] J'ai mis à jour `.env.local` avec la nouvelle clé
- [ ] J'ai vérifié que `.env` et `.env.local` ne sont pas trackés
- [ ] J'ai commit les fichiers de sécurité
- [ ] Si nécessaire, j'ai nettoyé l'historique Git

## 📋 Commandes de Vérification

```bash
# Vérifier que .env n'est pas tracké
git ls-files .env
# Ne devrait rien afficher

# Vérifier que .env est ignoré
git check-ignore .env
# Devrait afficher: .env

# Chercher des clés dans le code
npm run check-secrets
# Devrait afficher: ✅ No hardcoded API keys found

# Vérifier le statut avant push
npm run pre-push
# Devrait afficher: ✅ Safe to push
```

## 🔐 Configuration Correcte

Après avoir tout sécurisé :

```
Fichiers à commiter :
✅ .env.example (sans vraies clés)
✅ README.md
✅ SECURITY.md
✅ CODE_STRUCTURE.md
✅ DRAFT_MODE.md
✅ src/**/*.tsx (code source)
✅ package.json
✅ .gitignore

Fichiers à NE PAS commiter :
❌ .env
❌ .env.local
❌ node_modules/
❌ .next/
```

## 🚀 Pousser en Sécurité

Une fois tout sécurisé :

```bash
# Vérifier
npm run pre-push

# Ajouter les fichiers
git add .

# Commit
git commit -m "feat: add Bertrand AI assistant with security improvements"

# Push
git push origin main
```

## 📞 Support

Si vous avez des doutes ou des questions sur la sécurité :

1. Vérifiez d'abord que votre clé a été révoquée
2. Ne pushez RIEN avant d'avoir tout vérifié
3. En cas de doute, mieux vaut révoquer et recréer une clé

## 🎓 Pour l'Avenir

**Règles d'or :**
1. Ne JAMAIS commiter de fichiers .env*
2. Toujours vérifier avec `git status` avant de commit
3. Utiliser `npm run pre-push` avant chaque push
4. En cas de doute, révoquer et recréer une clé

---

**La sécurité avant tout ! 🔒**

