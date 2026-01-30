import 'dotenv/config'
import { PrismaClient } from '../prisma/generated/prisma/client.ts'
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg'

const connectionString = process.env.DATABASE_URL

const adapter = new PrismaPostgresAdapter({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }
