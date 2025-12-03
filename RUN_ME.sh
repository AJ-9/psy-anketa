#!/bin/bash

# Простой скрипт для быстрой настройки GitHub
# Запустите: bash RUN_ME.sh

TOKEN="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"
REPO_NAME="psy-anketa"

echo "🚀 Настройка GitHub репозитория..."
echo ""

# Шаг 1: Получаем username
echo "📡 Получение GitHub username..."
USERNAME=$(curl -s -H "Authorization: token $TOKEN" https://api.github.com/user | python3 -c "import sys, json; print(json.load(sys.stdin)['login'])" 2>/dev/null || curl -s -H "Authorization: token $TOKEN" https://api.github.com/user | grep -o '"login":"[^"]*' | cut -d'"' -f4)

if [ -z "$USERNAME" ]; then
    echo "❌ Не удалось получить username. Проверьте интернет и токен."
    exit 1
fi

echo "✅ Username: $USERNAME"
echo ""

# Шаг 2: Создаем репозиторий
echo "📦 Создание репозитория $REPO_NAME..."
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
    -H "Authorization: token $TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/user/repos \
    -d "{\"name\":\"$REPO_NAME\",\"description\":\"Онлайн справочник-анкетирование для психолога\",\"private\":false}")

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Репозиторий создан!"
else
    echo "⚠️  Репозиторий уже существует или ошибка (код: $HTTP_CODE)"
fi
echo ""

# Шаг 3: Настраиваем Git
echo "🔗 Настройка Git remote..."
cd /Users/alikbidzhiev/Documents/Cursor_Psy
git remote remove origin 2>/dev/null || true
git remote add origin "https://$TOKEN@github.com/$USERNAME/$REPO_NAME.git"
git branch -M main 2>/dev/null || true
echo "✅ Remote настроен"
echo ""

# Шаг 4: Коммит и push
echo "📝 Создание коммита..."
git add . 2>/dev/null || true
git commit -m "Initial commit: PsyAnketa" 2>/dev/null || echo "⚠️  Коммит уже существует"
echo ""

echo "🚀 Отправка на GitHub..."
git push -u origin main 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 УСПЕШНО! Репозиторий: https://github.com/$USERNAME/$REPO_NAME"
else
    echo ""
    echo "⚠️  Возможна ошибка. Проверьте:"
    echo "   - git remote -v"
    echo "   - git status"
fi

