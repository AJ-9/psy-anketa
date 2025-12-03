#!/bin/bash

# Скрипт для настройки Neon PostgreSQL базы данных (проще чем Supabase)

set -e

echo "🔧 Настройка Neon PostgreSQL базы данных"
echo ""
echo "Neon проще в использовании - Connection String показывается сразу с паролем!"
echo ""

echo "📋 Инструкция:"
echo ""
echo "1. Откройте: https://neon.tech"
echo "2. Войдите через GitHub или создайте аккаунт"
echo "3. Нажмите 'Create Project'"
echo "4. Заполните форму:"
echo "   - Name: psy-anketa"
echo "   - Region: выберите ближайший"
echo "5. Нажмите 'Create Project'"
echo "6. После создания Connection String будет показан сразу - скопируйте его"
echo ""
read -p "Нажмите Enter после создания проекта в Neon..."

echo ""
echo "📝 Вставьте Connection String из Neon (должен содержать пароль):"
read -p "DATABASE_URL: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Ошибка: DATABASE_URL не может быть пустым"
    exit 1
fi

# Проверяем формат
if [[ ! $DATABASE_URL == postgresql://* ]]; then
    echo "⚠️  Предупреждение: Connection String должен начинаться с 'postgresql://'"
    read -p "Продолжить? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        exit 1
    fi
fi

# Проверяем наличие Vercel CLI
if ! command -v vercel &> /dev/null && ! command -v npx &> /dev/null; then
    echo "❌ Ошибка: Vercel CLI не найден"
    echo "   Установите: npm install -g vercel"
    exit 1
fi

VERCEL_CMD="vercel"
if ! command -v vercel &> /dev/null; then
    VERCEL_CMD="npx vercel"
fi

# Проверяем авторизацию в Vercel
if ! $VERCEL_CMD whoami &> /dev/null; then
    echo "⚠️  Вы не авторизованы в Vercel"
    echo "   Выполняем: $VERCEL_CMD login"
    $VERCEL_CMD login
fi

echo ""
echo "📝 Добавляем DATABASE_URL для production..."
echo "$DATABASE_URL" | $VERCEL_CMD env add DATABASE_URL production

echo ""
echo "📝 Добавляем DATABASE_URL для preview..."
echo "$DATABASE_URL" | $VERCEL_CMD env add DATABASE_URL preview

echo ""
echo "📝 Добавляем DATABASE_URL для development..."
echo "$DATABASE_URL" | $VERCEL_CMD env add DATABASE_URL development

echo ""
echo "✅ DATABASE_URL успешно добавлен в Vercel!"
echo ""
echo "📝 Следующие шаги:"
echo "1. Передеплойте проект:"
echo "   git commit --allow-empty -m 'Trigger redeploy with Neon DB'"
echo "   git push origin main"
echo ""
echo "2. Проверьте панель психолога: https://psy-anketa.vercel.app/admin"
echo ""

