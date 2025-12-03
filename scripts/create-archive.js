#!/usr/bin/env node

/**
 * Скрипт для создания архива проекта
 * Использует Node.js для кроссплатформенности
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ARCHIVE_DIR = path.join(__dirname, '..', 'archives')
const PROJECT_DIR = path.join(__dirname, '..')

// Создаем директорию для архивов
if (!fs.existsSync(ARCHIVE_DIR)) {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true })
}

// Генерируем имя архива с timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
const archiveName = `psy-anketa_${timestamp}.tar.gz`
const archivePath = path.join(ARCHIVE_DIR, archiveName)

// Файлы и папки для исключения
const excludePatterns = [
  'node_modules',
  '.next',
  'archives',
  '.git',
  '*.db',
  '*.db-journal',
  '.env*.local',
  'dist',
  'build',
  'coverage',
  '.DS_Store',
]

// Создаем команду tar
const excludeArgs = excludePatterns.flatMap(pattern => ['--exclude', pattern])
const command = [
  'tar',
  '-czf',
  archivePath,
  ...excludeArgs,
  '-C',
  path.dirname(PROJECT_DIR),
  path.basename(PROJECT_DIR),
].join(' ')

try {
  console.log('📦 Создание архива...')
  execSync(command, { stdio: 'inherit' })
  
  // Получаем размер архива
  const stats = fs.statSync(archivePath)
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)
  
  console.log(`✅ Архив создан: ${archiveName}`)
  console.log(`📦 Размер: ${sizeMB} MB`)
  console.log(`📍 Путь: ${archivePath}`)
} catch (error) {
  console.error('❌ Ошибка при создании архива:', error.message)
  process.exit(1)
}

