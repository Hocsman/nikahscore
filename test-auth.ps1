# Test d'inscription PowerShell - NikahScore
# Test simple de l'API d'authentification

Write-Host "🚀 TEST D'INSCRIPTION NIKAHSCORE" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Générer un utilisateur de test unique
$timestamp = [DateTimeOffset]::Now.ToUnixTimeMilliseconds()
$testEmail = "demo-$timestamp@nikahscore-test.com"
$testUser = @{
    name = "Test User Demo"
    email = $testEmail
    password = "TestPassword123!"
}

Write-Host "👤 Utilisateur de test :" -ForegroundColor Cyan
Write-Host "   Nom: $($testUser.name)" -ForegroundColor White
Write-Host "   Email: $($testUser.email)" -ForegroundColor White
Write-Host "   Mot de passe: $($testUser.password)" -ForegroundColor White
Write-Host ""

# Convertir en JSON
$jsonBody = $testUser | ConvertTo-Json -Compress

Write-Host "📝 Test d'inscription..." -ForegroundColor Yellow

try {
    # Tester l'inscription
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" `
                                  -Method POST `
                                  -Body $jsonBody `
                                  -ContentType "application/json" `
                                  -ErrorAction Stop
    
    Write-Host "✅ INSCRIPTION RÉUSSIE !" -ForegroundColor Green
    Write-Host "🎉 Réponse du serveur :" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor White
    
    Write-Host ""
    Write-Host "🔐 Test de connexion..." -ForegroundColor Yellow
    
    # Tester la connexion
    $loginData = @{
        email = $testUser.email
        password = $testUser.password
    } | ConvertTo-Json -Compress
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
                                      -Method POST `
                                      -Body $loginData `
                                      -ContentType "application/json" `
                                      -ErrorAction Stop
    
    Write-Host "✅ CONNEXION RÉUSSIE !" -ForegroundColor Green
    Write-Host "🎉 Réponse de connexion :" -ForegroundColor Green
    $loginResponse | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor White
    
    Write-Host ""
    Write-Host "🎊 FÉLICITATIONS !" -ForegroundColor Magenta
    Write-Host "🎯 Votre système d'authentification fonctionne parfaitement !" -ForegroundColor Magenta
    Write-Host "👥 Les utilisateurs peuvent s'inscrire ET se connecter !" -ForegroundColor Magenta

} catch {
    Write-Host "❌ ERREUR :" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "📊 Code de statut : $statusCode" -ForegroundColor Yellow
        
        # Essayer de lire le contenu de l'erreur
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorContent = $reader.ReadToEnd()
            Write-Host "📄 Contenu de l'erreur : $errorContent" -ForegroundColor Yellow
        } catch {
            Write-Host "⚠️  Impossible de lire le contenu de l'erreur" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "🏁 Test terminé" -ForegroundColor Blue