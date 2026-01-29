# 🎭 Guide - Images des Personnages

## 📁 Structure des dossiers

Chaque personnage doit avoir son propre dossier avec 5 images d'humeur :

```
/public/
├── hermione/      ✅ (déjà créé)
│   ├── neutral.jpg
│   ├── sad.jpg
│   ├── happy.jpg
│   ├── angry.jpg
│   └── desperate.jpg
├── hagrid/        ⚠️ (à compléter)
│   ├── neutral.jpg
│   ├── sad.jpg
│   ├── happy.jpg
│   ├── angry.jpg
│   └── desperate.jpg
├── harry/         💡 (exemple pour nouveaux personnages)
│   ├── neutral.jpg
│   ├── sad.jpg
│   ├── happy.jpg
│   ├── angry.jpg
│   └── desperate.jpg
└── ...
```

## 🎨 Comment ajouter un nouveau personnage

### Étape 1 : Créer le dossier
Créez un dossier avec le **prénom** du personnage en minuscules :
- "Draco Malfoy" → `/public/draco/`
- "Ron Weasley" → `/public/ron/`
- "Albus Dumbledore" → `/public/dumbledore/`

### Étape 2 : Ajouter les 5 images
Chaque dossier doit contenir exactement ces 5 fichiers :

1. **neutral.jpg** - Expression neutre/normale
2. **sad.jpg** - Triste ou préoccupé
3. **happy.jpg** - Joyeux/souriant
4. **angry.jpg** - En colère ou contrarié
5. **desperate.jpg** - Désespéré

### Étape 3 : Format des images
- **Format** : JPG (recommandé)
- **Taille** : Minimum 500x500px (carré de préférence)
- **Qualité** : Haute résolution
- **Ratio** : 1:1 (carré) ou portrait

## 🔄 Détection automatique

Le système détecte automatiquement le personnage :

| Personnage dans le niveau | Dossier utilisé |
|---------------------------|-----------------|
| "Hermione Granger" | `/hermione/` |
| "Hagrid" | `/hagrid/` |
| "Harry Potter" | `/harry/` |
| "Ron Weasley" | `/ron/` |
| "Draco Malfoy" | `/draco/` |
| "Albus Dumbledore" | `/dumbledore/` |
| "Severus Snape" | `/snape/` |
| "Personnage Custom" | `/personnage/` |

## ⚠️ Image de secours

Si les images n'existent pas pour un personnage, le système utilisera automatiquement les images d'Hermione par défaut.

## 💡 Exemple : Ajouter Draco Malfoy

1. Créer `/public/draco/`
2. Ajouter :
   - `neutral.jpg` (Draco neutre)
   - `sad.jpg` (Draco triste)
   - `happy.jpg` (Draco content)
   - `angry.jpg` (Draco en colère)
   - `desperate.jpg` (Draco désespéré)
3. Dans le formulaire Admin, créer un niveau avec `"character": "Draco Malfoy"`
4. Le jeu utilisera automatiquement `/draco/*.jpg` ! ✨

## 🎯 Recommandations

- **Cohérence visuelle** : Utilisez le même style pour toutes les images d'un personnage
- **Éclairage** : Gardez un éclairage similaire entre les différentes émotions
- **Cadrage** : Centrez le visage du personnage
- **Arrière-plan** : Préférez un arrière-plan flou ou uni pour mettre en valeur le personnage
