#!/bin/bash

# Скрипт для добавления Neon Connection String в Vercel

set -e

# Connection String из Neon (без psql и кавычек)
DATABASE_URL="postgresql://neondb_owner:npg_3j1mavEnBlbV@ep-bitter-wildflower-a4lgzki8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

echo "🔧 Добавление Neon DATABASE_URL в Vercel"
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

# Проверяем авторизацию в Vercel
echo "🔍 Проверяем авторизацию в Vercel..."
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
echo "2. Или передеплойте вручную в Vercel Dashboard"
echo ""
echo "3. Проверьте панель психолога: https://psy-anketa.vercel.app/admin"
echo ""

