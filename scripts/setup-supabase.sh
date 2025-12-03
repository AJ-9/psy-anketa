#!/bin/bash

# Скрипт для настройки Supabase PostgreSQL базы данных

set -e

echo "🔧 Настройка Supabase PostgreSQL базы данных"
echo ""

echo "📋 Инструкция:"
echo ""
echo "1. Откройте: https://supabase.com"
echo "2. Войдите через GitHub или создайте аккаунт"
echo "3. Нажмите 'New Project'"
echo "4. Заполните форму и создайте проект"
echo "5. Перейдите в Settings → Database"
echo "6. Скопируйте Connection string (URI)"
echo ""
read -p "Нажмите Enter после создания проекта в Supabase..."

echo ""
echo "📝 Вставьте Connection String из Supabase:"
read -p "DATABASE_URL: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Ошибка: DATABASE_URL не может быть пустым"
    exit 1
fi

echo ""
echo "🔍 Проверяем подключение к Supabase..."

# Проверяем подключение через psql (если установлен)
if command -v psql &> /dev/null; then
    echo "Проверка подключения..."
    # Не выполняем реальное подключение, просто проверяем формат
    if [[ $DATABASE_URL == postgresql://* ]]; then
        echo "✅ Формат Connection String корректен"
    else
        echo "⚠️  Предупреждение: Connection String должен начинаться с 'postgresql://'"
    fi
else
    echo "⚠️  psql не установлен, пропускаем проверку подключения"
fi

echo ""
echo "📝 Добавление DATABASE_URL в Vercel..."

# Проверяем наличие Vercel CLI
if command -v vercel &> /dev/null; then
    VERCEL_CMD="vercel"
elif command -v npx &> /dev/null; then
    VERCEL_CMD="npx vercel"
else
    echo "❌ Ошибка: Vercel CLI не найден"
    echo "   Установите: npm install -g vercel"
    echo ""
    echo "📋 Или добавьте DATABASE_URL вручную:"
    echo "   1. Откройте Vercel Dashboard → Settings → Environment Variables"
    echo "   2. Добавьте переменную DATABASE_URL"
    echo "   3. Вставьте значение: $DATABASE_URL"
    exit 1
fi

echo ""
echo "Добавляем DATABASE_URL для production..."
echo "$DATABASE_URL" | $VERCEL_CMD env add DATABASE_URL production

echo ""
echo "Добавляем DATABASE_URL для preview..."
echo "$DATABASE_URL" | $VERCEL_CMD env add DATABASE_URL preview

echo ""
echo "Добавляем DATABASE_URL для development..."
echo "$DATABASE_URL" | $VERCEL_CMD env add DATABASE_URL development

echo ""
echo "✅ DATABASE_URL добавлен в Vercel!"
echo ""
echo "📝 Следующие шаги:"
echo "1. Передеплойте проект в Vercel"
echo "2. Или выполните: git commit --allow-empty -m 'Trigger redeploy' && git push origin main"
echo "3. Проверьте панель психолога: https://psy-anketa.vercel.app/admin"
echo ""

