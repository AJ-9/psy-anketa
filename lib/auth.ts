// Простая система аутентификации для панели психолога
// В production следует использовать более безопасные методы (JWT, sessions, etc.)

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'psy2024'

export interface AuthResult {
  success: boolean
  message?: string
}

export function verifyCredentials(username: string, password: string): AuthResult {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return { success: true }
  }
  return { success: false, message: 'Неверный логин или пароль' }
}

export function createSession(): string {
  // Простая сессия на основе времени (в production использовать JWT)
  return Buffer.from(`${ADMIN_USERNAME}:${Date.now()}`).toString('base64')
}

export function verifySession(session: string): boolean {
  try {
    const decoded = Buffer.from(session, 'base64').toString('utf-8')
    const [username] = decoded.split(':')
    return username === ADMIN_USERNAME
  } catch {
    return false
  }
}

