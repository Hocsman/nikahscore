#!/usr/bin/env node

/**
 * Chargeur de variables d'environnement pour les scripts
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Charger le fichier .env
const envPath = path.join(__dirname, '.env')

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim()
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=')
        process.env[key] = value
      }
    }
  })
  
  console.log('✅ Variables d\'environnement chargées depuis .env')
} else {
  console.warn('⚠️ Fichier .env non trouvé dans', __dirname)
}

export { }