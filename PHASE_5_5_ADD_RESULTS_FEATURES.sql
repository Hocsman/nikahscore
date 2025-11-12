-- ============================================
-- PHASE 5.5 : Ajouter Features pour Results Premium
-- Graphiques, analyse détaillée, comparaisons, recommandations
-- ============================================

-- 1️⃣ Ajouter les 4 nouvelles features pour la page results
INSERT INTO features (code, name, description, created_at)
VALUES 
  ('results_charts', 'Graphiques de Compatibilité', 'Graphique radar interactif des scores par dimension', NOW()),
  ('results_detailed_analysis', 'Analyse Détaillée', 'Décryptage approfondi de chaque catégorie avec conseils personnalisés', NOW()),
  ('results_comparison', 'Comparaison Communauté', 'Benchmarks et statistiques par rapport aux autres couples', NOW()),
  ('results_recommendations', 'Recommandations Premium', 'Sujets de discussion, ressources et prochaines étapes personnalisées', NOW())
ON CONFLICT (code) DO NOTHING;

-- 2️⃣ Associer ces features au plan PREMIUM
INSERT INTO plan_features (plan_name, feature_code, is_unlimited, usage_limit)
VALUES 
  ('premium', 'results_charts', false, NULL),
  ('premium', 'results_detailed_analysis', false, NULL),
  ('premium', 'results_comparison', false, NULL),
  ('premium', 'results_recommendations', false, NULL)
ON CONFLICT (plan_name, feature_code) DO NOTHING;

-- 3️⃣ Vérifier que les features ont été ajoutées
SELECT 
  f.code,
  f.name,
  f.description,
  CASE 
    WHEN pf.plan_name IS NOT NULL THEN '✅ Premium'
    ELSE '❌ Non disponible'
  END as availability
FROM features f
LEFT JOIN plan_features pf ON f.code = pf.feature_code AND pf.plan_name = 'premium'
WHERE f.code LIKE 'results_%'
ORDER BY f.created_at DESC;

-- 4️⃣ Compter le total de features par plan
SELECT 
  pf.plan_name,
  COUNT(pf.feature_code) as total_features
FROM plan_features pf
GROUP BY pf.plan_name
ORDER BY pf.plan_name;
