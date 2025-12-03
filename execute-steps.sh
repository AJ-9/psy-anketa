#!/bin/bash
# Выполнение шагов настройки GitHub

TOKEN="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"
REPO_NAME="psy-anketa"

echo "🔧 Настройка GitHub..."

# Шаг 1: Получаем username
echo "📡 Получение username..."
USERNAME=$(curl -s -H "Authorization: token $TOKEN" https://api.github.com/user | grep -o '"login":"[^"]*' | cut -d'"' -f4)
echo "Username: $USERNAME"

# Шаг 2: Создаем репозиторий
echo "📦 Создание репозитория..."
curl -X POST -H "Authorization: token $TOKEN" -H "Accept: application/vnd.github.v3+json" https://api.github.com/user/repos -d "{\"name\":\"$REPO_NAME\",\"description\":\"Онлайн справочник-анкетирование для психолога\",\"private\":false}"

# Шаг 3: Настраиваем remote
echo "🔗 Настройка remote..."
cd /Users/alikbidzhiev/Documents/Cursor_Psy
git remote remove origin 2>/dev/null
git remote add origin "https://$TOKEN@github.com/$USERNAME/$REPO_NAME.git"

# Шаг 4: Push
echo "🚀 Push..."
git branch -M main
git push -u origin main

echo "✅ Готово! https://github.com/$USERNAME/$REPO_NAME"

