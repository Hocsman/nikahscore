# 🔧 CORRECTIONS APPLIQUÉES - Erreur API Couple

## ❌ Problème identifié

**Erreur 500 sur `/api/couple`** lors de la création d'un couple.

**Cause racine**: Les fichiers API utilisaient les anciennes tables (`couple_questionnaires`, `couple_responses`) qui n'existent plus après la migration `20251031_couples_clean.sql`.

## ✅ Corrections appliquées

### 1. Migration manquante - Table `responses`

**Fichier créé**: `supabase/migrations/20251031_responses_table.sql`

La nouvelle migration crée la table `responses` pour stocker les réponses individuelles :

```sql
CREATE TABLE IF NOT EXISTS responses (
    id UUID PRIMARY KEY,
    couple_id UUID REFERENCES couples(id),
    user_id UUID REFERENCES auth.users(id),
    answers JSONB,
    is_completed BOOLEAN,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(couple_id, user_id)
);
```

**⚠️ ACTION REQUISE**: Exécuter cette migration sur Supabase :
1. Aller sur Supabase Dashboard
2. SQL Editor
3. Copier/coller le contenu de `20251031_responses_table.sql`
4. Exécuter

### 2. Corrections API

#### Fichier: `src/app/api/couple/route.ts`
- ✅ `couple_questionnaires` → `couples`
- ✅ Ajout de `status: 'waiting_partner'` lors de la création
- ✅ Suppression des jointures inutiles dans GET

#### Fichier: `src/app/api/couple/join/route.ts`
- ✅ `couple_questionnaires` → `couples`
- ✅ Ajout de `status: 'active'` quand le partenaire rejoint

#### Fichier: `src/app/api/couple/responses/route.ts`
- ✅ `couple_questionnaires` → `couples`
- ✅ `couple_responses` → `responses`
- ✅ Utilisation de `couple_id` au lieu de `couple_code`
- ✅ `responses` → `answers` (champ JSON)
- ✅ `submitted_at` → `completed_at`
- ✅ Ajout de `is_completed: true`
- ✅ Mise à jour des champs `creator_completed` et `partner_completed` dans `couples`

#### Fichier: `src/app/api/generate-report/route.ts`
- ✅ `couple_responses` → `responses`
- ✅ Utilisation de `couple_id` au lieu de `couple_code`
- ✅ Ajout du filtre `is_completed: true`

## 📋 Nouvelle structure de données

### Table `couples`
```typescript
{
  id: UUID,
  couple_code: string,        // ABC-12345
  creator_id: UUID,
  partner_id: UUID,
  status: 'waiting_partner' | 'active' | 'completed' | 'expired',
  creator_completed: boolean,
  partner_completed: boolean,
  created_at: timestamp,
  partner_joined_at: timestamp,
  completed_at: timestamp
}
```

### Table `responses`
```typescript
{
  id: UUID,
  couple_id: UUID,
  user_id: UUID,
  answers: {                  // JSONB
    "1": "answer1",
    "2": "answer2",
    // ...
  },
  is_completed: boolean,
  started_at: timestamp,
  completed_at: timestamp
}
```

### Table `compatibility_results`
```typescript
{
  id: UUID,
  couple_id: UUID,
  overall_score: number,
  spirituality_score: number,
  family_score: number,
  communication_score: number,
  values_score: number,
  finance_score: number,
  intimacy_score: number,
  strengths: JSONB[],
  improvements: JSONB[],
  recommendations: JSONB[],
  completed_at: timestamp
}
```

## 🚀 Prochaines étapes

1. **Exécuter la nouvelle migration** `20251031_responses_table.sql` sur Supabase
2. **Commiter et déployer** les changements sur Vercel
3. **Tester le flow complet** :
   - Créer un couple
   - Rejoindre avec le code
   - Remplir le questionnaire (2 utilisateurs)
   - Voir les résultats

## 🔍 Vérifications post-déploiement

```sql
-- Vérifier que les 4 tables existent
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('couples', 'responses', 'compatibility_results', 'subscriptions')
ORDER BY table_name;

-- Devrait retourner :
-- compatibility_results
-- couples
-- responses
-- subscriptions
```

## ✨ Résumé

- ✅ 4 fichiers API corrigés
- ✅ 1 nouvelle migration créée
- ✅ Structure de données alignée entre code et base de données
- ⏳ Migration `responses` à exécuter sur Supabase
- ⏳ Test du flow complet après déploiement
