import crypto from 'crypto'

/**
 * Hashe un email de manière sécurisée pour l'anonymisation
 * Utilise SHA-256 avec un sel statique pour maintenir la cohérence
 */
export function hashEmail(email: string): string {
  const normalizedEmail = email.toLowerCase().trim()
  const salt = process.env.EMAIL_HASH_SALT || 'nikahscore-default-salt'
  
  return crypto
    .createHash('sha256')
    .update(normalizedEmail + salt)
    .digest('hex')
}

/**
 * Génère un token d'invitation sécurisé et unique
 * Utilise 32 bytes de données aléatoires encodées en base64url
 */
export function generateInviteToken(): string {
  return crypto.randomBytes(32).toString('base64url')
}

/**
 * Génère un token JWT simple pour les sessions (MVP sans auth complète)
 */
export function generateSessionToken(data: Record<string, any>): string {
  const secret = process.env.JWT_SECRET || 'nikahscore-jwt-secret'
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    ...data,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24h
  })).toString('base64url')
  
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url')
  
  return `${header}.${payload}.${signature}`
}

/**
 * Vérifie et décode un token JWT simple
 */
export function verifySessionToken(token: string): Record<string, any> | null {
  try {
    const secret = process.env.JWT_SECRET || 'nikahscore-jwt-secret'
    const [header, payload, signature] = token.split('.')
    
    // Vérifier la signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64url')
    
    if (signature !== expectedSignature) {
      return null
    }
    
    // Décoder et vérifier l'expiration
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString())
    
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null // Token expiré
    }
    
    return decodedPayload
  } catch {
    return null
  }
}

/**
 * Chiffre des données sensibles (pour stockage temporaire)
 */
export function encryptData(data: string): string {
  const secret = process.env.ENCRYPTION_KEY || 'nikahscore-encryption-key'
  const algorithm = 'aes-256-gcm'
  const iv = crypto.randomBytes(16)
  
  const cipher = crypto.createCipher(algorithm, secret)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  return iv.toString('hex') + ':' + encrypted
}

/**
 * Déchiffre des données sensibles
 */
export function decryptData(encryptedData: string): string {
  const secret = process.env.ENCRYPTION_KEY || 'nikahscore-encryption-key'
  const algorithm = 'aes-256-gcm'
  const [ivHex, encrypted] = encryptedData.split(':')
  
  const decipher = crypto.createDecipher(algorithm, secret)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

/**
 * Génère un code OTP à 6 chiffres pour l'authentification par email
 */
export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString()
}

/**
 * Hashe un mot de passe avec bcrypt (si on implemente l'auth complète plus tard)
 */
export function hashPassword(password: string): string {
  const bcrypt = require('bcryptjs')
  return bcrypt.hashSync(password, 12)
}

/**
 * Vérifie un mot de passe contre son hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const bcrypt = require('bcryptjs')
  return bcrypt.compareSync(password, hash)
}

/**
 * Génère un identifiant unique court pour les liens publics
 */
export function generateShortId(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Valide la force d'un token (pour sécurité)
 */
export function validateTokenStrength(token: string): boolean {
  // Au moins 32 caractères avec mix de lettres, chiffres, symboles
  const minLength = 32
  const hasLetter = /[A-Za-z]/.test(token)
  const hasNumber = /\d/.test(token)
  const hasSymbol = /[^A-Za-z0-9]/.test(token)
  
  return token.length >= minLength && hasLetter && hasNumber && hasSymbol
}
