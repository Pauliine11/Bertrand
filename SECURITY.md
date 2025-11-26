# 🔒 Guide de Sécurité

Ce document explique comment protéger vos clés API et secrets.

## ✅ Liste de Vérification avant Push

Avant de pousser sur GitHub, vérifiez :

- [ ] Le fichier `.env.local` n'est PAS dans le repo
- [ ] Aucune clé API n'est en dur dans le code
- [ ] Le fichier `.env.example` est à jour (sans vraies clés)
- [ ] Le `.gitignore` contient `.env.local`

## 🔍 Commandes de Vérification

### Vérifier le statut Git
```bash
git status
```
→ `.env.local` ne doit PAS apparaître dans la liste

### Vérifier que .env.local est ignoré
```bash
git check-ignore .env.local
```
→ Doit afficher : `.env.local`

### Chercher des clés dans le code
```bash
grep -r "sk-" src/
```
→ Ne devrait rien trouver

### Vérifier l'historique Git
```bash
git log --all --full-history --source -- .env.local
```
→ Ne devrait rien afficher

## 🚨 Si vous avez commit une clé par erreur

### Étape 1 : RÉVOQUER la clé immédiatement
1. Allez sur [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Supprimez la clé compromise
3. Créez une nouvelle clé

### Étape 2 : Nettoyer l'historique Git

**Option A : Supprimer le dernier commit (si pas encore pushé)**
```bash
git reset --soft HEAD~1
git restore --staged .env.local
```

**Option B : Supprimer de l'historique (si déjà pushé)**
```bash
# Installer git-filter-repo
pip install git-filter-repo

# Supprimer le fichier de tout l'historique
git filter-repo --path .env.local --invert-paths

# Force push (ATTENTION : destructif)
git push origin --force --all
```

### Étape 3 : Mettre à jour .env.local
```bash
cp .env.example .env.local
# Éditer et ajouter la NOUVELLE clé
```

## 🛡️ Bonnes Pratiques

### DO ✅
- Utiliser `.env.local` pour les secrets
- Ajouter `.env.local` au `.gitignore`
- Fournir un `.env.example` avec des placeholders
- Documenter les variables d'environnement nécessaires
- Révoquer les clés compromises immédiatement

### DON'T ❌
- Ne JAMAIS commiter `.env.local`
- Ne JAMAIS mettre de clés en dur dans le code
- Ne JAMAIS partager vos clés API
- Ne JAMAIS pusher des secrets dans l'historique Git
- Ne JAMAIS utiliser de vraies clés dans les exemples

## 🔐 Variables d'Environnement

### Pour le Développement
Créer `.env.local` :
```env
NEXT_PUBLIC_OPENAI_KEY=sk-your-actual-key-here
```

### Pour la Production (Vercel, etc.)
Ajouter les variables via l'interface web :
- Vercel : Settings → Environment Variables
- Netlify : Site settings → Build & deploy → Environment
- AWS : Parameter Store ou Secrets Manager

## 📋 Checklist de Configuration

Nouveau développeur qui clone le projet :

1. Cloner le repo
```bash
git clone <repo-url>
cd my-app
```

2. Installer les dépendances
```bash
npm install
```

3. Créer `.env.local`
```bash
cp .env.example .env.local
```

4. Ajouter sa clé API
```bash
# Éditer .env.local
nano .env.local
```

5. Vérifier que tout fonctionne
```bash
npm run dev
```

## 🚀 Déploiement Sécurisé

### Vercel
```bash
# Ajouter la variable d'environnement
vercel env add NEXT_PUBLIC_OPENAI_KEY

# Déployer
vercel --prod
```

### Docker
```dockerfile
# .dockerignore
.env.local
.env
node_modules
.git

# Utiliser des secrets Docker
docker run -e NEXT_PUBLIC_OPENAI_KEY=... mon-app
```

## 🔍 Audit de Sécurité

Commandes pour auditer votre projet :

```bash
# Vérifier les fichiers trackés
git ls-files

# Chercher des patterns sensibles
grep -r "api[_-]key" .
grep -r "secret" .
grep -r "password" .
grep -r "sk-" .

# Vérifier .gitignore
cat .gitignore | grep env

# Lister les variables d'env
npm run env | grep OPENAI
```

## 📞 Support

Si vous pensez qu'une clé a été compromise :

1. **Révoquez immédiatement** sur la plateforme concernée
2. **Changez toutes les clés** potentiellement affectées
3. **Nettoyez l'historique Git** si nécessaire
4. **Surveillez** l'utilisation de vos APIs
5. **Documentez** l'incident pour éviter qu'il se reproduise

## 🔗 Ressources

- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Git Filter Repo](https://github.com/newren/git-filter-repo)
- [Best Practices](https://12factor.net/config)

---

**La sécurité est l'affaire de tous ! 🔒**

