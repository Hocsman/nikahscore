/**
 * Utilitaire de logging conditionnel
 * Les logs sont actifs uniquement en mode développement
 * En production, tous les logs sont supprimés automatiquement
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },
  
  error: (...args: any[]) => {
    // Les erreurs critiques sont toujours loggées
    console.error(...args)
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args)
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  }
}

// Alias pour la compatibilité
export default logger
