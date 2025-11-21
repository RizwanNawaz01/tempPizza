import dotenv from 'dotenv'
dotenv.config()

console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL)

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🧠 Testing Prisma connection...')
    const about = await prisma.about.findFirst()
    console.log('✅ Query result:', about)
  } catch (err) {
    console.error('❌ Prisma Error:')
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
