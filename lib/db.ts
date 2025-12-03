import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Используем PostgreSQL через DATABASE_URL
// Для локальной разработки можно использовать SQLite: DATABASE_URL="file:./prisma/dev.db"
// Для продакшена используйте Neon или другой PostgreSQL сервис
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl && process.env.NODE_ENV === 'production') {
  console.error(
    '⚠️  DATABASE_URL не установлен для продакшена. ' +
    'Установите переменную окружения DATABASE_URL с PostgreSQL connection string.'
  )
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl || 'file:./prisma/dev.db', // Fallback для локальной разработки
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

