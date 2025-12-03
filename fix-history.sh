#!/bin/bash

# Скрипт для удаления токена из истории Git

echo "🔧 Удаление токена из истории Git..."
echo ""

# Удаляем файлы с токеном из истории
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch GITHUB_TOKEN_SETUP.md RUN_ME.sh execute-steps.sh setup-github-manual.sh РЕШЕНИЕ_ПРОБЛЕМЫ.md SETUP_NOW.md' \
  --prune-empty --tag-name-filter cat -- --all

echo ""
echo "✅ История очищена"
echo ""
echo "Теперь выполните:"
echo "  git push -u origin main --force"
echo ""
echo "⚠️  ВНИМАНИЕ: Это перезапишет историю на GitHub!"

