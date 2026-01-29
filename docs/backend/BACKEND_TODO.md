# 🔧 Backend TODO - Le Grimoire Éveillé

## 📊 État Actuel du Backend

### ✅ **Déjà Implémenté**
- [x] Authentification Clerk
- [x] Base de données Supabase (PostgreSQL)
- [x] Server Actions pour le jeu (`playTurn`)
- [x] Server Actions pour la progression (`fetchUserProgression`, `completeLevel`)
- [x] API Route pour créer des niveaux (`/api/levels`)
- [x] Intégration OpenAI pour l'IA conversationnelle
- [x] Gestion basique des niveaux et progression

---

## 🎯 Backend à Compléter

### 🔴 **PRIORITÉ 1 - Essentiel pour la Production**

#### 1. **Sécurité & Validation** 🔒
```typescript
// À faire :
[ ] Rate Limiting sur les API Routes
[ ] Validation Zod pour toutes les entrées
[ ] Sanitization des inputs utilisateur
[ ] Protection CSRF pour les formulaires
[ ] Headers de sécurité (CORS, CSP, etc.)
[ ] Gestion sécurisée des erreurs (pas de leak d'info)
```

**Fichiers à créer:**
- `/src/middleware.ts` - Rate limiting global
- `/src/lib/security/rate-limiter.ts`
- `/src/lib/validations/` - Schémas Zod pour tous les endpoints

#### 2. **Gestion d'Erreurs Robuste** ⚠️
```typescript
// À faire :
[ ] Système de logging centralisé
[ ] Error boundaries côté serveur
[ ] Retry logic pour les appels OpenAI
[ ] Gestion des timeouts
[ ] Fallbacks pour les services externes
[ ] Notifications d'erreurs critiques
```

**Fichiers à créer:**
- `/src/lib/logger.ts` - Logger centralisé
- `/src/lib/error-handler.ts` - Gestionnaire d'erreurs
- `/src/lib/retry.ts` - Logique de retry

#### 3. **Base de Données - Compléments** 🗄️
```sql
-- À ajouter :
[ ] Indexes pour optimiser les requêtes
[ ] Contraintes de données manquantes
[ ] Triggers pour l'audit trail
[ ] Row Level Security (RLS) Supabase
[ ] Policies d'accès par utilisateur
[ ] Soft delete pour les données importantes
```

**Scripts à créer:**
- `/database/migrations/001_add_indexes.sql`
- `/database/migrations/002_add_rls.sql`
- `/database/migrations/003_add_audit.sql`

---

### 🟡 **PRIORITÉ 2 - Fonctionnalités Importantes**

#### 4. **Système de Profil Utilisateur** 👤
```typescript
// À implémenter :
[ ] Table user_profiles
[ ] Statistiques utilisateur (niveaux complétés, temps de jeu, etc.)
[ ] Préférences utilisateur (langue, notifications, etc.)
[ ] Avatar/customization
[ ] Historique des parties
```

**API à créer:**
- `GET /api/users/profile` - Récupérer le profil
- `PATCH /api/users/profile` - Mettre à jour le profil
- `GET /api/users/stats` - Statistiques de jeu

**Tables à créer:**
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  total_playtime INTEGER DEFAULT 0,
  levels_completed INTEGER DEFAULT 0,
  preferred_language TEXT DEFAULT 'fr',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  level_id UUID REFERENCES levels(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  messages_count INTEGER,
  outcome TEXT -- 'won', 'lost', 'abandoned'
);
```

#### 5. **Système de Sauvegarde de Conversation** 💬
```typescript
// À implémenter :
[ ] Sauvegarder les conversations complètes
[ ] Reprendre une partie en cours
[ ] Historique des parties précédentes
[ ] Export de conversations
```

**API à créer:**
- `POST /api/game/save` - Sauvegarder l'état du jeu
- `GET /api/game/load/:sessionId` - Charger une partie
- `GET /api/game/history` - Historique des parties
- `DELETE /api/game/session/:id` - Supprimer une session

**Table à créer:**
```sql
CREATE TABLE game_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES game_sessions(id),
  user_id TEXT NOT NULL,
  level_id UUID REFERENCES levels(id),
  messages JSONB NOT NULL,
  current_mood TEXT,
  turns_count INTEGER,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 6. **Analytics & Métriques** 📊
```typescript
// À implémenter :
[ ] Tracking des événements utilisateur
[ ] Métriques de performance
[ ] Taux de complétion par niveau
[ ] Temps moyen par niveau
[ ] Actions les plus utilisées
[ ] Dashboard admin avec stats
```

**API à créer:**
- `GET /api/admin/analytics/overview` - Vue d'ensemble
- `GET /api/admin/analytics/levels` - Stats par niveau
- `GET /api/admin/analytics/users` - Stats utilisateurs

**Table à créer:**
```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_date ON analytics_events(created_at);
```

#### 7. **Système d'Achievements/Badges** 🏆
```typescript
// À implémenter :
[ ] Définir des achievements
[ ] Tracker les conditions de déblocage
[ ] Notifier les utilisateurs
[ ] Afficher les badges obtenus
```

**API à créer:**
- `GET /api/achievements` - Liste des achievements
- `GET /api/users/achievements` - Achievements de l'utilisateur
- `POST /api/achievements/unlock` - Débloquer un achievement

**Tables à créer:**
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  icon_url TEXT,
  points INTEGER DEFAULT 0,
  rarity TEXT DEFAULT 'common' -- common, rare, epic, legendary
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

---

### 🟢 **PRIORITÉ 3 - Améliorations & Nice-to-Have**

#### 8. **Admin Dashboard Backend** 🛠️
```typescript
// À implémenter :
[ ] CRUD complet pour les niveaux
[ ] Gestion des utilisateurs (ban, stats, etc.)
[ ] Modération de contenu
[ ] Logs système accessibles
[ ] Configuration en temps réel
```

**API à créer:**
- `GET /api/admin/levels` - Liste tous les niveaux
- `PUT /api/admin/levels/:id` - Modifier un niveau
- `DELETE /api/admin/levels/:id` - Supprimer un niveau
- `GET /api/admin/users` - Liste utilisateurs
- `PATCH /api/admin/users/:id/ban` - Bannir un utilisateur
- `GET /api/admin/logs` - Logs système

#### 9. **Système de Cache** ⚡
```typescript
// À implémenter :
[ ] Cache Redis pour les données fréquentes
[ ] Cache des niveaux
[ ] Cache des profils utilisateurs
[ ] Invalidation intelligente du cache
```

**Fichiers à créer:**
- `/src/lib/cache/redis.ts`
- `/src/lib/cache/strategies.ts`

#### 10. **WebSockets pour le Temps Réel** 🔄
```typescript
// À implémenter (si multijoueur souhaité) :
[ ] Connexion WebSocket
[ ] Notifications en temps réel
[ ] Présence utilisateur
[ ] Chat entre joueurs (optionnel)
```

**Fichiers à créer:**
- `/src/lib/websocket/server.ts`
- `/src/lib/websocket/client.ts`

#### 11. **Système de Leaderboard** 🥇
```typescript
// À implémenter :
[ ] Classement global
[ ] Classement par niveau
[ ] Classement hebdomadaire/mensuel
[ ] Points et scoring system
```

**API à créer:**
- `GET /api/leaderboard/global` - Classement global
- `GET /api/leaderboard/level/:id` - Classement par niveau
- `GET /api/leaderboard/user/:id/rank` - Position d'un utilisateur

**Table à créer:**
```sql
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  level_id UUID REFERENCES levels(id),
  score INTEGER NOT NULL,
  completion_time INTEGER, -- en secondes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, level_id)
);
```

#### 12. **API Webhooks** 🔗
```typescript
// À implémenter :
[ ] Webhooks Clerk pour sync utilisateurs
[ ] Webhooks pour événements du jeu
[ ] Notifications externes (Discord, Slack, etc.)
```

**API à créer:**
- `POST /api/webhooks/clerk` - Sync utilisateurs Clerk
- `POST /api/webhooks/game-events` - Événements du jeu

#### 13. **Système de Backup** 💾
```typescript
// À implémenter :
[ ] Backup automatique de la DB
[ ] Export/Import de données utilisateur
[ ] Versioning des niveaux
[ ] Rollback capability
```

**Scripts à créer:**
- `/scripts/backup-db.ts`
- `/scripts/restore-db.ts`
- `/scripts/export-user-data.ts`

#### 14. **API de Modération de Contenu** 🛡️
```typescript
// À implémenter :
[ ] Filtrage de contenu inapproprié
[ ] Détection de spam
[ ] Modération automatique via AI
[ ] Queue de modération manuelle
```

**API à créer:**
- `POST /api/moderation/check` - Vérifier un contenu
- `GET /api/admin/moderation/queue` - Queue de modération
- `POST /api/admin/moderation/approve/:id`
- `POST /api/admin/moderation/reject/:id`

#### 15. **Optimisation OpenAI** 🤖
```typescript
// À améliorer :
[ ] Streaming des réponses OpenAI
[ ] Cache des réponses similaires
[ ] Fallback vers modèle moins cher si nécessaire
[ ] Monitoring des coûts API
[ ] A/B testing de prompts
```

**Fichiers à créer:**
- `/src/lib/openai/streaming.ts`
- `/src/lib/openai/cache.ts`
- `/src/lib/openai/cost-monitor.ts`

---

## 🧪 **Tests Backend**

```typescript
// À implémenter :
[ ] Tests unitaires pour Server Actions
[ ] Tests d'intégration pour API Routes
[ ] Tests de charge/performance
[ ] Tests de sécurité
[ ] Tests E2E pour les flux critiques
```

**Fichiers à créer:**
- `/tests/unit/game-actions.test.ts`
- `/tests/integration/api-levels.test.ts`
- `/tests/load/game-load.test.ts`
- `/tests/security/injection.test.ts`

---

## 📦 **Infrastructure & DevOps**

```typescript
// À mettre en place :
[ ] CI/CD pipeline
[ ] Monitoring (Sentry, LogRocket, etc.)
[ ] Health checks
[ ] Métriques de performance (APM)
[ ] Documentation API (OpenAPI/Swagger)
[ ] Environnements (dev, staging, prod)
```

---

## 🎯 **Recommandations par Phase**

### **Phase 1 (MVP Production-Ready) - 2-3 semaines**
1. Sécurité & Validation
2. Gestion d'Erreurs Robuste
3. RLS Supabase
4. Tests critiques

### **Phase 2 (Fonctionnalités Utilisateur) - 3-4 semaines**
1. Profil Utilisateur
2. Sauvegarde de Conversation
3. Analytics de base
4. Admin Dashboard

### **Phase 3 (Gamification) - 2-3 semaines**
1. Achievements
2. Leaderboard
3. Analytics avancées
4. WebSockets (si besoin)

### **Phase 4 (Optimisation) - 1-2 semaines**
1. Cache Redis
2. Optimisation OpenAI
3. Performance monitoring
4. Documentation API

---

## 💰 **Estimation Totale**

- **Phase 1 (Essentiel):** ~60-80 heures
- **Phase 2 (Important):** ~80-100 heures
- **Phase 3 (Nice-to-Have):** ~40-60 heures
- **Phase 4 (Optimisation):** ~20-40 heures

**Total estimé:** 200-280 heures (5-7 semaines à temps plein)

---

## 🚀 **Par Où Commencer ?**

**Top 3 Priorités Immédiates:**

1. **Rate Limiting** - Protéger contre les abus
2. **RLS Supabase** - Sécuriser les données
3. **Error Handling** - Expérience utilisateur stable

Voulez-vous que je commence par implémenter l'une de ces priorités ? 🎯
