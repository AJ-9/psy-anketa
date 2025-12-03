# ✅ ПРОСТОЕ РЕШЕНИЕ

GitHub блокирует push, потому что токен в старом коммите. Есть 2 варианта:

## Вариант 1: Разрешить секрет через GitHub (САМЫЙ ПРОСТОЙ)

Просто перейдите по ссылке, которую дал GitHub:
```
https://github.com/AJ-9/psy-anketa/security/secret-scanning/unblock-secret/36K1jxWIA8Z0bXWLy3oH5O5EufM
```

Нажмите "Allow secret" и затем снова выполните:
```bash
git push -u origin main
```

## Вариант 2: Переписать историю (удалить токен из всех коммитов)

```bash
cd /Users/alikbidzhiev/Documents/Cursor_Psy

# Удалить файлы с токеном из истории
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch GITHUB_TOKEN_SETUP.md RUN_ME.sh execute-steps.sh setup-github-manual.sh РЕШЕНИЕ_ПРОБЛЕМЫ.md SETUP_NOW.md' \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push -u origin main --force
```

⚠️ **ВНИМАНИЕ:** Force push перезапишет историю на GitHub!

## Вариант 3: Создать новый репозиторий без истории

```bash
cd /Users/alikbidzhiev/Documents/Cursor_Psy

# Удалить .git
rm -rf .git

# Инициализировать заново
git init
git add .
git commit -m "Initial commit: PsyAnketa"

# Добавить remote
git remote add origin https://github.com/AJ-9/psy-anketa.git
git branch -M main

# Push (нужно будет удалить старый репозиторий на GitHub и создать новый)
git push -u origin main --force
```

---

**Рекомендую Вариант 1 - самый простой!** Просто перейдите по ссылке и разрешите секрет.

