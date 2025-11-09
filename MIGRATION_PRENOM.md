# Migration : Ajout du Prénom et Nom d'utilisateur

## 📋 Objectif
Cette migration ajoute les colonnes `first_name` (prénom) et `last_name` (nom) à la table `users` pour personnaliser l'expérience utilisateur.

## 🚀 Comment exécuter la migration

### Étape 1 : Accéder à Supabase Dashboard
1. Connectez-vous à [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet **NikahScore**
3. Allez dans **SQL Editor** (dans le menu latéral gauche)

### Étape 2 : Exécuter le script SQL
1. Créez une nouvelle requête (bouton "New query")
2. Copiez le contenu du fichier `supabase/migrations/20251109_add_user_names.sql`
3. Collez-le dans l'éditeur
4. Cliquez sur **Run** (ou Ctrl+Enter)

### Étape 3 : Vérifier la migration
Exécutez cette requête pour vérifier que les colonnes ont été ajoutées :

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('first_name', 'last_name');
```

Résultat attendu :
```
column_name  | data_type         | is_nullable
-------------|-------------------|------------
first_name   | character varying | NO
last_name    | character varying | YES
```

### Étape 4 : Vérifier les utilisateurs existants
Si vous avez des utilisateurs existants, vérifiez qu'ils ont bien reçu un prénom par défaut :

```sql
SELECT id, email, first_name, last_name 
FROM users 
LIMIT 5;
```

Les utilisateurs existants auront leur prénom généré depuis la partie avant le @ de leur email.

## 📝 Modifications apportées

### 1. Base de données (Supabase)
- ✅ Ajout colonne `first_name` VARCHAR(100) NOT NULL
- ✅ Ajout colonne `last_name` VARCHAR(100) NULL
- ✅ Mise à jour des utilisateurs existants avec prénom par défaut
- ✅ Index créé sur `first_name` pour optimiser les recherches

### 2. Formulaire d'inscription (`src/app/auth/page.tsx`)
- ✅ Remplacement du champ "Nom complet" par :
  - **Prénom** (requis) avec astérisque rouge
  - **Nom** (optionnel) avec indication "(optionnel)"
- ✅ Validation client : prénom requis, nom optionnel

### 3. API d'inscription (`src/app/api/auth/register/route.ts`)
- ✅ Réception de `firstName` et `lastName` au lieu de `name`
- ✅ Stockage dans `user_metadata` de Supabase Auth
- ✅ Insertion dans table `users` avec les nouveaux champs
- ✅ Email de bienvenue personnalisé avec le prénom

### 4. Hook d'authentification (`src/hooks/useAuth.ts`)
- ✅ Interface `AuthUser` étendue avec `firstName` et `lastName`
- ✅ Récupération depuis `user_metadata.first_name` et `user_metadata.last_name`
- ✅ Rétrocompatibilité avec `user_metadata.name` (anciens comptes)
- ✅ Fallback sur email si aucun prénom n'est trouvé

### 5. Affichage dans l'interface
- ✅ **Dashboard** : "Salam {Prénom} 👋" au lieu de l'email
- ✅ **Navbar** : Affichage du prénom dans le bouton utilisateur
- ✅ **NavbarSimple** : Idem pour la version simple

## 🎯 Flux utilisateur mis à jour

### Inscription
1. Utilisateur remplit : **Prénom** (requis), **Nom** (optionnel), **Email**, **Mot de passe**
2. API stocke dans `user_metadata` : `{ first_name: "Ahmed", last_name: "Benali" }`
3. API crée l'entrée dans table `users` avec `first_name` et `last_name`
4. Email de bienvenue : "Bonjour **Ahmed** !"

### Connexion
1. `useAuth` récupère la session Supabase
2. Lit `user_metadata.first_name` et `user_metadata.last_name`
3. Met à jour l'état avec : `{ id, email, firstName, lastName, name }`

### Affichage
1. **Dashboard** : "Salam Ahmed 👋"
2. **Navbar** : Bouton avec "Ahmed"
3. **Emails** : Personnalisés avec le prénom

## ⚠️ Migration des utilisateurs existants

Si des utilisateurs existent déjà dans votre base de données :

1. La migration remplit automatiquement `first_name` avec :
   - La partie avant @ de leur email
   - Exemple : `test@example.com` → prénom = "test"

2. Le `last_name` reste NULL (optionnel)

3. Les utilisateurs pourront modifier leur prénom dans leur profil (fonctionnalité future)

## 🔄 Rétrocompatibilité

Le code est rétrocompatible :
- ✅ Anciens comptes avec `user_metadata.name` → utilisé comme `firstName`
- ✅ Fallback sur email si aucun prénom trouvé
- ✅ Propriété `name` maintenue dans `AuthUser` pour les anciens composants

## 🧪 Tests recommandés

1. **Test inscription** :
   - Créer un compte avec prénom "Ahmed" et nom "Benali"
   - Vérifier l'email de bienvenue
   - Vérifier l'entrée dans la table `users`

2. **Test affichage** :
   - Se connecter
   - Vérifier le dashboard : "Salam Ahmed 👋"
   - Vérifier la navbar : bouton "Ahmed"

3. **Test rétrocompatibilité** :
   - Tester avec un ancien compte (si existant)
   - Vérifier que le prénom s'affiche correctement

## 📊 Requêtes SQL utiles

### Voir tous les utilisateurs avec leurs prénoms
```sql
SELECT id, email, first_name, last_name, created_at 
FROM users 
ORDER BY created_at DESC;
```

### Compter les utilisateurs avec/sans nom de famille
```sql
SELECT 
  COUNT(*) as total,
  COUNT(last_name) as avec_nom,
  COUNT(*) - COUNT(last_name) as sans_nom
FROM users;
```

### Mettre à jour un prénom manuellement
```sql
UPDATE users 
SET first_name = 'Ahmed', last_name = 'Benali'
WHERE email = 'ahmed@example.com';
```

## ✅ Checklist de déploiement

- [x] Migration SQL créée
- [x] Formulaire d'inscription mis à jour
- [x] API d'inscription adaptée
- [x] Hook useAuth modifié
- [x] Dashboard et Navbar mis à jour
- [ ] **Migration SQL exécutée sur Supabase** 👈 À FAIRE
- [ ] Test inscription en production
- [ ] Test affichage prénom
- [ ] Commit et push des changements

## 🚨 Important

**N'oubliez pas d'exécuter la migration SQL sur Supabase avant de déployer !**

Sinon, les nouveaux utilisateurs ne pourront pas s'inscrire car la colonne `first_name` sera manquante dans la table `users`.
