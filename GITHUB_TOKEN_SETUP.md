# 🔐 Настройка GitHub с токеном

Ваш токен получен. Выполните следующие команды:

## Шаг 1: Создайте репозиторий на GitHub

Перейдите на: https://github.com/new

- **Repository name:** `psy-anketa`
- **Description:** `Онлайн справочник-анкетирование для психолога`
- **Visibility:** Public или Private
- **НЕ** ставьте галочки на инициализацию
- Нажмите **"Create repository"**

## Шаг 2: Узнайте ваш GitHub username

Откройте: https://github.com/settings/profile

Ваш username будет вверху страницы (например: `alikbidzhiev`)

## Шаг 3: Настройте Git remote

Замените `YOUR_USERNAME` на ваш GitHub username:

```bash
cd /Users/alikbidzhiev/Documents/Cursor_Psy

# Удалите старый remote (если есть)
git remote remove origin 2>/dev/null

# Добавьте новый remote с токеном
git remote add origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/psy-anketa.git

# Переименуйте ветку в main
git branch -M main

# Запушьте код
git push -u origin main
```

## Или используйте скрипт:

```bash
cd /Users/alikbidzhiev/Documents/Cursor_Psy
./setup-github.sh
```

## После успешного push:

Ваш репозиторий будет доступен по адресу:
```
https://github.com/YOUR_USERNAME/psy-anketa
```

## ⚠️ Безопасность токена:

После успешной настройки **рекомендуется**:

1. Удалить токен из remote URL:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/psy-anketa.git
```

2. Настроить credential helper:
```bash
git config credential.helper osxkeychain
```

3. При следующем push Git попросит ввести:
   - **Username:** ваш GitHub username
   - **Password:** вставьте токен (не пароль!)

## Проверка:

```bash
# Проверить remote
git remote -v

# Проверить статус
git status

# Проверить последний коммит
git log --oneline -1
```

## Проблемы?

### Ошибка "remote origin already exists"
```bash
git remote remove origin
# Затем выполните команды из Шага 3
```

### Ошибка авторизации
- Проверьте правильность токена
- Убедитесь, что токен имеет права `repo`
- Попробуйте создать новый токен: GitHub → Settings → Developer settings → Personal access tokens

### Ошибка "repository not found"
- Убедитесь, что репозиторий создан на GitHub
- Проверьте правильность username в URL

