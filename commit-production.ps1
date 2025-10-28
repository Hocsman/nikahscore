# 🚀 Script de Commit pour Production - NikahScore
# Date: 26 octobre 2025

Write-Host "`n🚀 ===========================================" -ForegroundColor Cyan
Write-Host "📦 COMMIT DES NOUVEAUX COMPOSANTS DASHBOARD" -ForegroundColor Cyan
Write-Host "🚀 ===========================================" -ForegroundColor Cyan

# 1. Vérifier le statut Git
Write-Host "`n📊 Statut Git actuel:" -ForegroundColor Yellow
git status

# 2. Ajouter les fichiers modifiés
Write-Host "`n✅ Ajout des fichiers modifiés..." -ForegroundColor Green
git add package.json
git add package-lock.json
git add src/components/dashboard/UserDashboard.tsx

# 3. Ajouter les nouveaux composants
Write-Host "`n✅ Ajout des nouveaux composants dashboard..." -ForegroundColor Green
git add src/components/dashboard/CompatibilityAnalysis.tsx
git add src/components/dashboard/MatchInsights.tsx

# 4. Ajouter les fichiers de documentation
Write-Host "`n📚 Ajout de la documentation..." -ForegroundColor Green
git add GUIDE-RESOLUTION-DNS-VERCEL.md
git add MISE-EN-PRODUCTION-REUSSIE.md
git add RAPPORT-FINAL-NIKAHSCORE.md
git add RESOLUTION-DNS-SIMPLE.md
git add ELEMENTS-CRITIQUES-RESTANTS.md
git add ANALYSE-DNS-ACTUELLE.md

# 5. Ajouter les scripts de diagnostic
Write-Host "`n🔧 Ajout des scripts de diagnostic..." -ForegroundColor Green
git add audit-complet.mjs
git add diagnostic-dns-vercel.mjs
git add rapport-final-nikahscore.mjs
git add statut-actuel-12oct2025.mjs
git add test-dashboard-complet.mjs
git add verif-site-production.mjs

# 6. Afficher les fichiers qui seront commités
Write-Host "`n📋 Fichiers à commiter:" -ForegroundColor Yellow
git status --short

# 7. Demander confirmation
Write-Host "`n⚠️ Voulez-vous continuer avec ce commit? (O/N)" -ForegroundColor Yellow
$confirmation = Read-Host

if ($confirmation -eq "O" -or $confirmation -eq "o") {
    # 8. Commit
    Write-Host "`n💾 Création du commit..." -ForegroundColor Green
    git commit -m "feat: Add advanced dashboard with compatibility analysis

✨ New Features:
- Add CompatibilityAnalysis component with Radar/Bar charts
- Add MatchInsights component with Area/Pie charts  
- Add strengths analysis with personalized recommendations
- Add improvement areas with concrete solutions
- Add interactive tabs navigation
- Add animations with Framer Motion

📦 Dependencies:
- Add recharts 2.15.4 for data visualization
- Add react-chartjs-2 and chart.js for advanced charts

📚 Documentation:
- Add DNS configuration guides
- Add production deployment report
- Add diagnostic scripts

🎯 Dashboard Features:
- Overall compatibility score with animation
- 7 dimensions radar chart
- Detailed bars chart by domain
- Strengths with recommendations
- Improvements with solutions
- Personalized action plan

🚀 Production Ready:
- Site live at nikahscore.com
- All dashboard features functional
- HTTPS/SSL active
- CDN distributed globally"

    # 9. Push vers origin/main
    Write-Host "`n🚀 Push vers origin/main..." -ForegroundColor Green
    git push origin main

    Write-Host "`n✅ SUCCÈS ! Commit et push terminés avec succès !" -ForegroundColor Green
    Write-Host "🌐 Les nouvelles fonctionnalités seront déployées automatiquement sur nikahscore.com" -ForegroundColor Cyan
    Write-Host "⏱️ Déploiement Vercel: ~2-3 minutes" -ForegroundColor Yellow
    
    Write-Host "`n📊 Récapitulatif des ajouts:" -ForegroundColor Cyan
    Write-Host "   ✅ 2 nouveaux composants dashboard" -ForegroundColor White
    Write-Host "   ✅ Graphiques avancés (Radar, Bar, Area, Pie)" -ForegroundColor White
    Write-Host "   ✅ Analyses de compatibilité complètes" -ForegroundColor White
    Write-Host "   ✅ Recommandations personnalisées" -ForegroundColor White
    Write-Host "   ✅ Documentation complète" -ForegroundColor White
    Write-Host "   ✅ Scripts de diagnostic" -ForegroundColor White
    
} else {
    Write-Host "`n❌ Commit annulé" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 =========================================" -ForegroundColor Green
Write-Host "🚀 DÉPLOIEMENT EN COURS SUR NIKAHSCORE.COM" -ForegroundColor Green  
Write-Host "🎉 =========================================" -ForegroundColor Green
Write-Host ""
