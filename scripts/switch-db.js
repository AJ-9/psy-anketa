#!/usr/bin/env node

/**
 * Скрипт для переключения между SQLite (локально) и PostgreSQL (продакшен)
 * 
 * Использование:
 *   node scripts/switch-db.js sqlite   - переключить на SQLite для локальной разработки
 *   node scripts/switch-db.js postgres - переключить на PostgreSQL для продакшена
 */

const fs = require('fs')
const path = require('path')

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma')
const schemaContent = fs.readFileSync(schemaPath, 'utf-8')

const provider = process.argv[2] || 'postgres'

if (provider === 'sqlite') {
  const updated = schemaContent.replace(
    /provider\s*=\s*"postgresql"/,
    'provider = "sqlite"'
  )
  fs.writeFileSync(schemaPath, updated)
  console.log('✅ Переключено на SQLite для локальной разработки')
  console.log('   Запустите: npx prisma generate')
} else if (provider === 'postgres') {
  const updated = schemaContent.replace(
    /provider\s*=\s*"sqlite"/,
    'provider = "postgresql"'
  )
  fs.writeFileSync(schemaPath, updated)
  console.log('✅ Переключено на PostgreSQL для продакшена')
  console.log('   Запустите: npx prisma generate')
} else {
  console.error('❌ Неверный провайдер. Используйте: sqlite или postgres')
  process.exit(1)
}

