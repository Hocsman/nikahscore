# Script PowerShell de migration automatique NikahScore
# Automatise l'installation des dépendances et l'exécution de la migration

param(
    [Parameter(HelpMessage="Mode d'exécution: install, migrate, validate, ou all")]
    [ValidateSet("install", "migrate", "validate", "all")]
    [string]$Mode = "all",
    
    [Parameter(HelpMessage="Forcer la réinstallation des dépendances")]
    [switch]$Force,
    
    [Parameter(HelpMessage="Mode test (dry-run)")]
    [switch]$DryRun,
    
    [Parameter(HelpMessage="Afficher les détails de débogage")]
    [switch]$Verbose
)

# Configuration
$ScriptDir = $PSScriptRoot
$RootDir = Split-Path $ScriptDir -Parent
$EnvFile = Join-Path $ScriptDir ".env"
$ExampleEnvFile = Join-Path $ScriptDir ".env.example"

Write-Host "🚀 SCRIPT DE MIGRATION NIKAHSCORE" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Mode: $Mode" -ForegroundColor Yellow
Write-Host "Répertoire: $ScriptDir" -ForegroundColor Gray

# Fonction pour afficher les messages colorés
function Write-StatusMessage {
    param(
        [string]$Message,
        [string]$Type = "Info" # Info, Success, Warning, Error
    )
    
    $color = switch ($Type) {
        "Success" { "Green" }
        "Warning" { "Yellow" }
        "Error" { "Red" }
        default { "White" }
    }
    
    $prefix = switch ($Type) {
        "Success" { "✅" }
        "Warning" { "⚠️" }
        "Error" { "❌" }
        default { "ℹ️" }
    }
    
    Write-Host "$prefix $Message" -ForegroundColor $color
}

# Fonction pour vérifier Node.js
function Test-NodeJs {
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-StatusMessage "Node.js détecté: $nodeVersion" "Success"
            return $true
        }
    } catch {
        # Ignore l'erreur
    }
    
    Write-StatusMessage "Node.js non trouvé. Veuillez installer Node.js depuis https://nodejs.org" "Error"
    return $false
}

# Fonction pour vérifier les variables d'environnement
function Test-Environment {
    if (-not (Test-Path $EnvFile)) {
        Write-StatusMessage "Fichier .env non trouvé" "Warning"
        
        if (Test-Path $ExampleEnvFile) {
            Write-StatusMessage "Copie du fichier .env.example vers .env..." "Info"
            Copy-Item $ExampleEnvFile $EnvFile
            Write-StatusMessage "Fichier .env créé. Veuillez le configurer avec vos clés Supabase." "Warning"
            Write-StatusMessage "Ouvrez le fichier $EnvFile et remplissez vos variables." "Warning"
            return $false
        } else {
            Write-StatusMessage "Fichier .env.example non trouvé" "Error"
            return $false
        }
    }
    
    # Vérifier le contenu du fichier .env
    $envContent = Get-Content $EnvFile -Raw
    $missingVars = @()
    
    if ($envContent -notmatch "NEXT_PUBLIC_SUPABASE_URL=.+") {
        $missingVars += "NEXT_PUBLIC_SUPABASE_URL"
    }
    
    if ($envContent -notmatch "SUPABASE_SERVICE_ROLE_KEY=.+") {
        $missingVars += "SUPABASE_SERVICE_ROLE_KEY"
    }
    
    if ($missingVars.Count -gt 0) {
        Write-StatusMessage "Variables d'environnement manquantes: $($missingVars -join ', ')" "Error"
        Write-StatusMessage "Veuillez configurer le fichier $EnvFile" "Error"
        return $false
    }
    
    Write-StatusMessage "Configuration d'environnement validée" "Success"
    return $true
}

# Fonction pour installer les dépendances
function Install-Dependencies {
    Write-StatusMessage "Installation des dépendances npm..." "Info"
    
    Set-Location $ScriptDir
    
    if ($Force -or -not (Test-Path "node_modules")) {
        if ($Force) {
            Write-StatusMessage "Suppression des dépendances existantes..." "Info"
            if (Test-Path "node_modules") {
                Remove-Item "node_modules" -Recurse -Force
            }
            if (Test-Path "package-lock.json") {
                Remove-Item "package-lock.json" -Force
            }
        }
        
        try {
            npm install
            if ($LASTEXITCODE -eq 0) {
                Write-StatusMessage "Dépendances installées avec succès" "Success"
                return $true
            } else {
                Write-StatusMessage "Erreur lors de l'installation des dépendances" "Error"
                return $false
            }
        } catch {
            Write-StatusMessage "Erreur lors de l'exécution de npm install: $_" "Error"
            return $false
        }
    } else {
        Write-StatusMessage "Dépendances déjà installées (utilisez -Force pour réinstaller)" "Info"
        return $true
    }
}

# Fonction pour exécuter la migration
function Start-Migration {
    Write-StatusMessage "Démarrage de la migration des 100 questions..." "Info"
    
    Set-Location $ScriptDir
    
    # Charger les variables d'environnement
    if (Test-Path $EnvFile) {
        Get-Content $EnvFile | ForEach-Object {
            if ($_ -match "^([^#][^=]+)=(.*)$") {
                [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
            }
        }
    }
    
    try {
        if ($DryRun) {
            Write-StatusMessage "MODE TEST - Aucune modification ne sera effectuée" "Warning"
            # Pour un dry-run, on pourrait implémenter une version test
            return $true
        }
        
        Write-StatusMessage "Exécution de la migration..." "Info"
        node migrate-personality-questions.mjs
        
        if ($LASTEXITCODE -eq 0) {
            Write-StatusMessage "Migration terminée avec succès!" "Success"
            return $true
        } else {
            Write-StatusMessage "Erreur lors de la migration (code: $LASTEXITCODE)" "Error"
            return $false
        }
    } catch {
        Write-StatusMessage "Erreur lors de l'exécution de la migration: $_" "Error"
        return $false
    }
}

# Fonction pour valider la migration
function Start-Validation {
    Write-StatusMessage "Validation de la migration..." "Info"
    
    Set-Location $ScriptDir
    
    # Charger les variables d'environnement
    if (Test-Path $EnvFile) {
        Get-Content $EnvFile | ForEach-Object {
            if ($_ -match "^([^#][^=]+)=(.*)$") {
                [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
            }
        }
    }
    
    try {
        node validate-questions.mjs
        
        if ($LASTEXITCODE -eq 0) {
            Write-StatusMessage "Validation terminée avec succès!" "Success"
            return $true
        } else {
            Write-StatusMessage "Erreur lors de la validation (code: $LASTEXITCODE)" "Error"
            return $false
        }
    } catch {
        Write-StatusMessage "Erreur lors de l'exécution de la validation: $_" "Error"
        return $false
    }
}

# Script principal
try {
    # Vérification de Node.js
    if (-not (Test-NodeJs)) {
        exit 1
    }
    
    # Vérification de l'environnement
    if (-not (Test-Environment)) {
        Write-StatusMessage "Veuillez configurer votre environnement avant de continuer" "Error"
        Write-StatusMessage "Instructions:" "Info"
        Write-StatusMessage "1. Ouvrez le fichier $EnvFile" "Info"
        Write-StatusMessage "2. Remplacez 'your_*_here' par vos vraies valeurs Supabase" "Info"
        Write-StatusMessage "3. Relancez ce script" "Info"
        exit 1
    }
    
    # Exécution selon le mode
    $success = $true
    
    if ($Mode -eq "install" -or $Mode -eq "all") {
        $success = $success -and (Install-Dependencies)
    }
    
    if (($Mode -eq "migrate" -or $Mode -eq "all") -and $success) {
        $success = $success -and (Start-Migration)
    }
    
    if (($Mode -eq "validate" -or $Mode -eq "all") -and $success) {
        $success = $success -and (Start-Validation)
    }
    
    # Résultats finaux
    if ($success) {
        Write-Host ""
        Write-StatusMessage "🎉 OPÉRATION TERMINÉE AVEC SUCCÈS!" "Success"
        Write-StatusMessage "Votre base de données NikahScore est prête pour la production" "Success"
        Write-StatusMessage "Prochaines étapes:" "Info"
        Write-StatusMessage "1. Testez votre application localement" "Info"
        Write-StatusMessage "2. Déployez vers votre environnement de production" "Info"
        Write-StatusMessage "3. Félicitations pour votre lancement d'octobre 2025!" "Info"
    } else {
        Write-Host ""
        Write-StatusMessage "❌ OPÉRATION ÉCHOUÉE" "Error"
        Write-StatusMessage "Veuillez consulter les messages d'erreur ci-dessus" "Error"
        exit 1
    }
    
} catch {
    Write-StatusMessage "Erreur inattendue: $_" "Error"
    exit 1
} finally {
    # Retour au répertoire original
    Set-Location $RootDir
}

Write-Host ""
Write-Host "Merci d'utiliser les scripts de migration NikahScore! 🚀" -ForegroundColor Cyan