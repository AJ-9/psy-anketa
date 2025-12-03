#!/bin/bash

# Скрипт для добавления DATABASE_URL в Vercel

set -e

echo "🔧 Добавление DATABASE_URL в Vercel"
echo ""

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

echo "📝 Вставьте полный Connection String из Supabase:"
echo "   (должен начинаться с postgresql:// и содержать ваш пароль)"
echo ""
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

# Проверяем, что пароль заменен
if [[ $DATABASE_URL == *"[YOUR_PASSWORD]"* ]] || [[ $DATABASE_URL == *"YOUR_PASSWORD"* ]]; then
    echo "❌ Ошибка: Замените [YOUR_PASSWORD] на ваш реальный пароль!"
    echo ""
    echo "📋 Где найти пароль:"
    echo "1. В Supabase Dashboard → Settings → Database"
    echo "2. Найдите секцию 'Database password'"
    echo "3. Нажмите 'Show' или 'Reveal' чтобы увидеть пароль"
    echo "4. Или нажмите 'Reset database password' чтобы создать новый"
    echo ""
    echo "💡 После получения пароля замените [YOUR_PASSWORD] в Connection String"
    echo "   Пример: postgresql://postgres:ваш_пароль@db.zjyvnudhrbldcsakxlyr.supabase.co:5432/postgres"
    exit 1
fi

echo ""
echo "🔍 Проверяем подключение к Vercel..."

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
echo "   git commit --allow-empty -m 'Trigger redeploy with Supabase DB'"
echo "   git push origin main"
echo ""
echo "2. Или передеплойте вручную в Vercel Dashboard"
echo ""
echo "3. Проверьте панель психолога: https://psy-anketa.vercel.app/admin"
echo ""

