import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Используем DATABASE_URL из переменных окружения
// Для локальной разработки с SQLite используйте: DATABASE_URL="file:./prisma/dev.db"
// Для продакшена (Vercel) используйте PostgreSQL через DATABASE_URL из переменных окружения
// ВАЖНО: Для продакшена на Vercel обязательно установите DATABASE_URL с PostgreSQL connection string
function getDatabaseUrl() {
  return process.env.DATABASE_URL || (process.env.NODE_ENV === 'development' ? 'file:./prisma/dev.db' : undefined)
}

export const prisma = globalForPrisma.prisma ?? (() => {
  const databaseUrl = getDatabaseUrl()
  
  // Не выбрасываем ошибку во время сборки, только во время выполнения
  if (!databaseUrl && typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    console.error(
      '⚠️  DATABASE_URL не установлен для продакшена. ' +
      'Установите переменную окружения DATABASE_URL с PostgreSQL connection string в Vercel Dashboard.'
    )
  }
  
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl || 'file:./prisma/dev.db', // Fallback для сборки
      },
    },
  })
})()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

