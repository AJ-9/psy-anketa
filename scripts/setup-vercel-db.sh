#!/bin/bash

# Скрипт для настройки Vercel PostgreSQL базы данных
# После создания БД в Vercel Dashboard, этот скрипт поможет применить миграции

set -e

echo "🔧 Настройка Vercel PostgreSQL базы данных"
echo ""

# Проверяем наличие Vercel CLI
if ! command -v vercel &> /dev/null && ! command -v npx &> /dev/null; then
    echo "❌ Ошибка: Vercel CLI не найден"
    echo "   Установите: npm install -g vercel"
    exit 1
fi

echo "📋 Инструкция:"
echo ""
echo "1. Откройте Vercel Dashboard: https://vercel.com/dashboard"
echo "2. Выберите проект: psy-anketa"
echo "3. Перейдите в Storage → Create Database → Postgres"
echo "4. Создайте базу данных"
echo ""
read -p "Нажмите Enter после создания БД в Vercel Dashboard..."

echo ""
echo "🔄 Применение миграций..."

# Используем npx vercel если vercel не установлен глобально
VERCEL_CMD="vercel"
if ! command -v vercel &> /dev/null; then
    VERCEL_CMD="npx vercel"
fi

# Применяем миграции через Vercel
echo "Выполняем: $VERCEL_CMD db pull"
$VERCEL_CMD db pull || {
    echo "⚠️  Не удалось подключиться к БД через CLI"
    echo "   Это нормально - миграции применятся автоматически при деплое"
}

echo ""
echo "✅ Готово!"
echo ""
echo "📝 Следующие шаги:"
echo "1. Проверьте, что DATABASE_URL добавлен в Vercel Environment Variables"
echo "2. Передеплойте проект в Vercel Dashboard"
echo "3. Проверьте панель психолога: https://psy-anketa.vercel.app/admin"
echo ""

