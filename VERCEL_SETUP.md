# Настройка Vercel для PsyAnketa

## Проблема с Prisma Client

Ошибка `at new t (/vercel/path0/node_modules/@prisma/client/runtime/library.js:130:739)` возникает потому, что Prisma Client не генерируется автоматически на Vercel.

## Решение

### ✅ Что уже исправлено:

1. **Добавлен `postinstall` скрипт** в `package.json`:
   ```json
   "postinstall": "prisma generate"
   ```
   Это гарантирует, что Prisma Client будет сгенерирован после установки зависимостей.

2. **Обновлен `build` скрипт**:
   ```json
   "build": "prisma generate && next build"
   ```
   Двойная защита - Prisma Client генерируется и перед сборкой.

3. **Обновлен Prisma schema** для использования переменной окружения `DATABASE_URL`.

### ⚠️ Важно: SQLite не работает на Vercel

SQLite использует файловую систему, которая недоступна на serverless функциях Vercel.

**Решение:** Используйте облачную базу данных (PostgreSQL, MySQL, или другую).

## Настройка базы данных на Vercel

### Вариант 1: Vercel Postgres (рекомендуется)

1. В Vercel Dashboard откройте проект `psy-anketa`
2. Перейдите в раздел **Storage** → **Create Database** → **Postgres**
3. Создайте базу данных
4. Vercel автоматически добавит переменную окружения `POSTGRES_PRISMA_URL`

### Вариант 2: Внешняя база данных (например, Supabase, Neon, PlanetScale)

1. Создайте базу данных на выбранном провайдере
2. В Vercel Dashboard откройте проект → **Settings** → **Environment Variables**
3. Добавьте переменную:
   - **Name:** `DATABASE_URL`
   - **Value:** `postgresql://user:password@host:5432/database?schema=public`
   - **Environment:** Production, Preview, Development

### Обновление Prisma schema для PostgreSQL

После настройки базы данных обновите `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Затем выполните миграцию:

```bash
npx prisma migrate deploy
```

## Проверка

После настройки:

1. Vercel автоматически пересоберет проект
2. Проверьте логи сборки - не должно быть ошибок Prisma
3. Проверьте работу API endpoints (`/api/responses`)

## Локальная разработка

Для локальной разработки создайте файл `.env.local`:

```env
DATABASE_URL="file:./dev.db"
```

И выполните:

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

