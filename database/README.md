# 🗄️ Base de Données - Le Grimoire Éveillé

## 📋 Tables Principales

### 1. `levels`
Contient tous les niveaux/chapitres du jeu.

**Colonnes:**
- `id` (uuid) - Identifiant unique
- `title` (text) - Titre du niveau
- `description` (text) - Description courte
- `order_index` (integer) - Ordre d'affichage
- `is_active` (boolean) - Niveau visible ou caché
- `content` (jsonb) - Configuration complète du niveau
- `created_at` (timestamp) - Date de création

### 2. `user_level_progress`
Suit la progression de chaque utilisateur.

**Colonnes:**
- `id` (uuid) - Identifiant unique
- `user_id` (text) - ID de l'utilisateur Clerk
- `level_id` (uuid) - Référence au niveau
- `is_completed` (boolean) - Niveau terminé ou non
- `started_at` (timestamp) - Date de début
- `completed_at` (timestamp) - Date de fin

---

## 🚀 Initialisation de la Base de Données

### Étape 1 : Créer les Tables (si pas déjà fait)

Allez dans **Supabase Dashboard** > **SQL Editor** et exécutez:

```sql
-- Table des niveaux
CREATE TABLE IF NOT EXISTS levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table de progression
CREATE TABLE IF NOT EXISTS user_level_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  level_id UUID REFERENCES levels(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, level_id)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_levels_active ON levels(is_active);
CREATE INDEX IF NOT EXISTS idx_levels_order ON levels(order_index);
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_level_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_level ON user_level_progress(level_id);
```

### Étape 2 : Peupler avec des Données

Exécutez le fichier `seed.sql` dans le **SQL Editor** de Supabase.

```bash
# Ou copiez-collez le contenu de database/seed.sql
```

---

## ✅ Vérification

Pour vérifier que tout fonctionne:

```sql
-- Voir tous les niveaux
SELECT * FROM levels ORDER BY order_index;

-- Compter les niveaux actifs
SELECT COUNT(*) as total_actifs FROM levels WHERE is_active = true;

-- Voir la progression d'un utilisateur spécifique
SELECT 
  l.title,
  p.is_completed,
  p.started_at,
  p.completed_at
FROM user_level_progress p
JOIN levels l ON l.id = p.level_id
WHERE p.user_id = 'VOTRE_USER_ID'
ORDER BY l.order_index;
```

---

## 🎮 Utilisation dans le Jeu

### Niveaux par Défaut (Hardcodés)
Le niveau Hermione est **toujours disponible** même sans base de données (défini dans `src/features/story/data.ts`).

### Niveaux Dynamiques (Base de Données)
Les niveaux dans la table `levels` sont **ajoutés automatiquement** au jeu s'ils sont actifs (`is_active = true`).

### Progression Automatique
Quand un utilisateur termine un niveau, l'application **enregistre automatiquement** sa progression dans `user_level_progress`.

---

## 🛠️ Ajouter un Nouveau Niveau

### Option 1 : Via l'Interface Admin
1. Allez sur `/admin/levels/new`
2. Remplissez le formulaire
3. Le niveau est ajouté automatiquement

### Option 2 : Via SQL
```sql
INSERT INTO levels (title, description, order_index, is_active, content)
VALUES (
  'Votre Titre',
  'Votre description',
  4,  -- Ordre d'affichage
  true,  -- Actif
  '{
    "character": "Nom du personnage",
    "initial_mood": "neutral",
    "location": "Lieu",
    "objective": "Objectif du niveau",
    "suggested_actions": ["Action 1", "Action 2"]
  }'::jsonb
);
```

---

## 🔄 Réinitialiser les Données

**⚠️ ATTENTION : Cela supprime toutes les données !**

```sql
-- Supprimer toutes les progressions
DELETE FROM user_level_progress;

-- Supprimer tous les niveaux
DELETE FROM levels;

-- Puis réexécutez seed.sql
```

---

## 📊 État Actuel

Après avoir exécuté `seed.sql`, vous aurez :
- ✅ **2 niveaux actifs** (Hermione + Hagrid)
- ✅ **1 niveau inactif** (Luna - pour test)
- ✅ **Configuration JSON complète** pour chaque niveau
- ✅ **Prêt à l'emploi** immédiatement

---

## 🐛 Dépannage

### "Column 'content' does not exist"
Ajoutez la colonne:
```sql
ALTER TABLE levels ADD COLUMN content JSONB;
```

### "user_id type mismatch"
Les IDs Clerk sont en `TEXT`, pas `UUID`:
```sql
ALTER TABLE user_level_progress 
ALTER COLUMN user_id TYPE TEXT;
```

### "No levels showing in game"
Vérifiez que les niveaux sont actifs:
```sql
UPDATE levels SET is_active = true;
```
