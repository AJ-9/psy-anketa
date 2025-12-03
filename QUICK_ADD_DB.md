# ⚡ Быстрое добавление DATABASE_URL в Vercel

У вас уже есть Connection String из Neon! Теперь нужно добавить его в Vercel.

## ✅ Выполните эти команды:

### Шаг 1: Авторизуйтесь в Vercel

```bash
npx vercel login
```

Откроется браузер для авторизации. Войдите в свой аккаунт Vercel.

### Шаг 2: Добавьте DATABASE_URL

После авторизации выполните:

```bash
# Добавьте для production
echo "postgresql://neondb_owner:npg_3j1mavEnBlbV@ep-bitter-wildflower-a4lgzki8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" | npx vercel env add DATABASE_URL production

# Добавьте для preview
echo "postgresql://neondb_owner:npg_3j1mavEnBlbV@ep-bitter-wildflower-a4lgzki8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" | npx vercel env add DATABASE_URL preview

# Добавьте для development
echo "postgresql://neondb_owner:npg_3j1mavEnBlbV@ep-bitter-wildflower-a4lgzki8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" | npx vercel env add DATABASE_URL development
```

### Шаг 3: Передеплойте проект

```bash
git commit --allow-empty -m "Trigger redeploy with Neon DB"
git push origin main
```

Или передеплойте вручную в Vercel Dashboard.

---

## 🎯 Или используйте автоматический скрипт:

```bash
# Сначала авторизуйтесь
npx vercel login

# Затем запустите скрипт
./ADD_DATABASE_URL.sh
```

---

## ✅ После деплоя:

1. Подождите завершения деплоя (1-2 минуты)
2. Откройте: `https://psy-anketa.vercel.app/admin`
3. Войдите в панель психолога
4. Анкеты должны загрузиться без ошибок!

---

**Готово! После выполнения этих шагов база данных будет работать!**

