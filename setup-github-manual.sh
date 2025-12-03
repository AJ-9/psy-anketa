#!/bin/bash

# Скрипт с ручным вводом username (если автоматическое получение не работает)

TOKEN="YOUR_GITHUB_TOKEN_HERE"
REPO_NAME="psy-anketa"

echo "🔧 Настройка GitHub репозитория..."
echo ""

# Пробуем получить username автоматически
echo "📡 Попытка получить GitHub username..."
API_RESPONSE=$(curl -s -H "Authorization: token $TOKEN" -H "Accept: application/vnd.github.v3+json" https://api.github.com/user 2>&1)

USERNAME=$(echo "$API_RESPONSE" | grep -o '"login":"[^"]*' | cut -d'"' -f4)

# Если не получилось - просим ввести вручную
if [ -z "$USERNAME" ]; then
    echo "⚠️  Не удалось получить username автоматически."
    echo ""
    echo "Введите ваш GitHub username вручную:"
    echo "   (можно найти на https://github.com/settings/profile)"
    read -p "Username: " USERNAME
    
    if [ -z "$USERNAME" ]; then
        echo "❌ Username не может быть пустым!"
        exit 1
    fi
else
    echo "✅ Username получен: $USERNAME"
fi
echo ""

# Создаем репозиторий
echo "📦 Шаг 2: Создание репозитория $REPO_NAME..."
REPO_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token $TOKEN" -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/$USERNAME/$REPO_NAME 2>/dev/null)

if [ "$REPO_EXISTS" = "200" ]; then
    echo "✅ Репозиторий уже существует: https://github.com/$USERNAME/$REPO_NAME"
else
    echo "Создание репозитория..."
    RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
        -H "Authorization: token $TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        https://api.github.com/user/repos \
        -d "{\"name\":\"$REPO_NAME\",\"description\":\"Онлайн справочник-анкетирование для психолога\",\"private\":false}" 2>/dev/null)
    
    HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
    
    if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
        echo "✅ Репозиторий создан: https://github.com/$USERNAME/$REPO_NAME"
    else
        echo "⚠️  Ошибка при создании (код: $HTTP_CODE). Возможно репозиторий уже существует."
    fi
fi
echo ""

# Настраиваем Git
echo "🔗 Шаг 3: Настройка Git remote..."
cd /Users/alikbidzhiev/Documents/Cursor_Psy
git remote remove origin 2>/dev/null || true
git remote add origin "https://$TOKEN@github.com/$USERNAME/$REPO_NAME.git"
echo "✅ Remote настроен"
echo ""

# Создаем коммит
echo "📝 Шаг 4: Создание коммита..."
git branch -M main 2>/dev/null || true
git add . 2>/dev/null || true
git commit -m "Initial commit: PsyAnketa - психологическое анкетирование

- Расширенная анкета с 40+ вопросами
- Определение типа личности
- Анализ психологического состояния
- Генерация рекомендаций
- Сохранение в БД (Prisma + SQLite)
- Экспорт в PDF
- Панель психолога" 2>/dev/null || echo "⚠️  Коммит уже существует"
echo ""

# Push
echo "🚀 Шаг 5: Отправка на GitHub..."
git push -u origin main 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 УСПЕШНО! Репозиторий: https://github.com/$USERNAME/$REPO_NAME"
    echo ""
    echo "⚠️  Для безопасности выполните:"
    echo "   git remote set-url origin https://github.com/$USERNAME/$REPO_NAME.git"
else
    echo ""
    echo "⚠️  Возможна ошибка. Проверьте:"
    echo "   git remote -v"
    echo "   git status"
fi

