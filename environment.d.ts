import express from 'express'
import { User } from './prisma/generated/prisma/client.ts'

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test'
            PORT?: string
            DATABASE_URL: string
            API_KEY: string
            JWT_SECRET: string
        }
        interface Global {
            req: express.Request & { user: User }
        }
    }
}

// Converts the file into a module
export {}
