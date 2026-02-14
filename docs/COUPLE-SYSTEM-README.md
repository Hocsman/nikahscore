# 💕 Système de Questionnaire Couple - NikahScore

## 🎯 Objectif Développé
Système complet de questionnaire partagé entre couples pour analyser leur compatibilité matrimoniale selon les valeurs islamiques.

## 🏗️ Architecture Mise en Place

### 1. Base de Données (À déployer)
```sql
📁 couple-system-simple.sql - Script de déploiement optimisé
```
- **couple_questionnaires** : Table principale avec codes uniques
- **couple_responses** : Stockage des réponses des partenaires  
- **RLS Policies** : Sécurité et privacy par défaut
- **Fonction generate_couple_code()** : Génération codes uniques 6 caractères

### 2. API Routes Créées ✅
```typescript
📁 /api/couple/route.ts          - Création et récupération couples
📁 /api/couple/join/route.ts     - Jonction d'un partenaire
📁 /api/couple/responses/route.ts - Gestion réponses couple
```

### 3. Pages Interface Utilisateur ✅
```typescript  
📁 /app/couple/page.tsx                    - Hub central couples
📁 /app/questionnaire/couple/[code]/page.tsx - Page de jonction avec code
```

### 4. Hooks & Logique Métier ✅
```typescript
📁 /hooks/useCouple.ts - Hook complet pour gestion couples
```
- Création questionnaires couple
- Jonction partenaires avec codes
- Soumission réponses
- Calcul compatibilité basique

### 5. Navigation & UX ✅ 
```typescript
📁 /components/NavbarSimple.tsx - Navigation avec accès couple
📁 /app/layout.tsx - Intégration navbar globale
```

## 🔄 Flux Utilisateur Complet

### Étape 1 : Création 
1. Utilisateur connecté va sur `/couple`
2. Clique "Créer un Questionnaire Couple"
3. Code unique généré (ex: `ABC123`)
4. URL de partage créée automatiquement

### Étape 2 : Invitation
1. Lien de partage : `/questionnaire/couple/ABC123`
2. Partenaire clique sur le lien 
3. S'inscrit/connecte si nécessaire
4. Rejoint le questionnaire couple

### Étape 3 : Questionnaire
1. Chaque partenaire répond individuellement
2. Réponses stockées de façon séparée et sécurisée
3. Statut mis à jour automatiquement

### Étape 4 : Résultats (À développer)
1. Une fois les 2 partenaires terminés
2. Analyse de compatibilité générée
3. Affichage résultats comparatifs

## 🚀 Instructions de Déploiement

### 1. Base de Données
```bash
# Ouvrir Supabase Dashboard → SQL Editor
# Copier-coller le contenu de couple-system-simple.sql
# Cliquer "Run"
```

### 2. Test du Système  
```bash
npm run dev
# Visiter http://localhost:3000/couple
# Créer un questionnaire couple
# Tester le partage avec un autre navigateur/session
```

### 3. Vérifications
- ✅ Tables créées dans Supabase
- ✅ Fonction `generate_couple_code()` active
- ✅ Politiques RLS configurées
- ✅ Navigation fonctionnelle

## 📊 Fonctionnalités Développées

### ✅ Terminé
- [x] Architecture base de données complète
- [x] APIs CRUD pour couples  
- [x] Interface de création questionnaires
- [x] Système de codes de partage uniques
- [x] Jonction partenaires sécurisée
- [x] Gestion des réponses individuelles
- [x] Navigation intégrée
- [x] Hooks de logique métier

### 🚧 À Développer (Phase 2)
- [ ] Page de résultats couple (`/results/couple/[code]`)
- [ ] Algorithme de compatibilité avancé
- [ ] Visualisations comparatives
- [ ] Recommandations personnalisées
- [ ] Système de notifications email
- [ ] Dashboard couple avec historique

## 🎨 Design System
- **Couleurs Couple** : Pink/Purple gradient  
- **Icônes** : Heart, Users, Share2
- **UX** : Codes courts et mémorables
- **Responsive** : Mobile-first approach

## 🔒 Sécurité & Privacy
- **RLS Policies** : Chaque couple voit uniquement ses données
- **Codes Uniques** : 6 caractères, collision-proof
- **Authentification** : Obligatoire pour participer
- **Isolation** : Réponses séparées jusqu'aux résultats

## 📱 Prêt pour Production
Le système est architecturalement prêt. Il manque juste :
1. Le déploiement du schéma SQL
2. Le développement de la page résultats
3. Les tests utilisateurs

**Status** : 🟡 Phase 1 complète, Phase 2 en attente de validation utilisateur
