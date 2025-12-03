# 🔧 Добавление DATABASE_URL в Vercel

## Ваш Connection String из Neon:

```
postgresql://neondb_owner:npg_3j1mavEnBlbV@ep-bitter-wildflower-a4lgzki8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Способ 1: Через Vercel CLI (рекомендуется)

### Шаг 1: Авторизуйтесь в Vercel

```bash
npx vercel login
```

Откроется браузер - войдите в Vercel через GitHub.

### Шаг 2: Добавьте DATABASE_URL

```bash
# Добавьте для production
echo "postgresql://neondb_owner:npg_3j1mavEnBlbV@ep-bitter-wildflower-a4lgzki8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" | npx vercel env add DATABASE_URL production

# Добавьте для preview
echo "postgresql://neondb_owner:npg_3j1mavEnBlbV@ep-bitter-wildflower-a4lgzki8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" | npx vercel env add DATABASE_URL preview

# Добавьте для development
echo "postgresql://neondb_owner:npg_3j1mavEnBlbV@ep-bitter-wildflower-a4lgzki8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" | npx vercel env add DATABASE_URL development
```

Или используйте автоматический скрипт (после авторизации):

```bash
./scripts/add-neon-db.sh
```

---

## Способ 2: Через Vercel Dashboard (если можете зайти)

1. Откройте: https://vercel.com/dashboard
2. Выберите проект: **psy-anketa**
3. Перейдите в **Settings** → **Environment Variables**
4. Нажмите **Add New**
5. Добавьте:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://neondb_owner:npg_3j1mavEnBlbV@ep-bitter-wildflower-a4lgzki8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - Выберите все окружения: Production, Preview, Development
6. Нажмите **Save**

---

## После добавления DATABASE_URL

### Передеплойте проект:

```bash
git commit --allow-empty -m "Trigger redeploy with Neon DB"
git push origin main
```

Или передеплойте вручную в Vercel Dashboard.

---

## Проверка

После деплоя:

1. Подождите завершения деплоя (1-2 минуты)
2. Откройте: `https://psy-anketa.vercel.app/admin`
3. Войдите в панель психолога
4. Анкеты должны загрузиться без ошибок!

---

**Готово! После добавления DATABASE_URL и передеплоя база данных будет работать!**

