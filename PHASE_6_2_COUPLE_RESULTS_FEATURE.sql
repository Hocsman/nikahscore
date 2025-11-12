-- ============================================
-- PHASE 6.2 : Feature Comparaison Résultats Couple
-- ============================================

-- Ajouter la feature "Comparaison Résultats Couple"
INSERT INTO features (code, name, description, created_at)
VALUES (
  'couple_results_comparison',
  'Comparaison Résultats Couple',
  'Voir la comparaison détaillée des questionnaires de compatibilité avec votre partenaire',
  NOW()
)
ON CONFLICT (code) DO NOTHING;

-- Associer cette feature aux plans PREMIUM et CONSEIL
INSERT INTO plan_features (plan_name, feature_code, is_unlimited, usage_limit)
VALUES 
  ('premium', 'couple_results_comparison', true, NULL),
  ('conseil', 'couple_results_comparison', true, NULL)
ON CONFLICT (plan_name, feature_code) DO NOTHING;

-- Vérification
SELECT 
  f.code,
  f.name,
  CASE 
    WHEN pf_premium.plan_name IS NOT NULL THEN '✅ Premium'
    ELSE ''
  END as premium,
  CASE 
    WHEN pf_conseil.plan_name IS NOT NULL THEN '✅ Conseil'
    ELSE ''
  END as conseil
FROM features f
LEFT JOIN plan_features pf_premium ON f.code = pf_premium.feature_code AND pf_premium.plan_name = 'premium'
LEFT JOIN plan_features pf_conseil ON f.code = pf_conseil.feature_code AND pf_conseil.plan_name = 'conseil'
WHERE f.code = 'couple_results_comparison';

-- Compter les features par plan
SELECT 
  pf.plan_name,
  COUNT(pf.feature_code) as total_features
FROM plan_features pf
GROUP BY pf.plan_name
ORDER BY pf.plan_name;
