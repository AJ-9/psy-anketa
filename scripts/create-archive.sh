#!/bin/bash

# Скрипт для создания архива проекта

ARCHIVE_DIR="archives"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ARCHIVE_NAME="psy-anketa_${TIMESTAMP}.tar.gz"
ARCHIVE_PATH="${ARCHIVE_DIR}/${ARCHIVE_NAME}"

# Создаем директорию для архивов если её нет
mkdir -p "${ARCHIVE_DIR}"

# Создаем архив, исключая ненужные файлы
tar -czf "${ARCHIVE_PATH}" \
  --exclude="node_modules" \
  --exclude=".next" \
  --exclude="archives" \
  --exclude=".git" \
  --exclude="*.db" \
  --exclude="*.db-journal" \
  --exclude=".env*.local" \
  --exclude="dist" \
  --exclude="build" \
  --exclude="coverage" \
  -C .. \
  Cursor_Psy

echo "✅ Архив создан: ${ARCHIVE_PATH}"
echo "📦 Размер: $(du -h "${ARCHIVE_PATH}" | cut -f1)"

