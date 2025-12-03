import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Используем SQLite для локальной разработки
// Для продакшена можно использовать PostgreSQL через DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db'

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

