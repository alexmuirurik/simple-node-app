import express from 'express'
import { login, register } from './app/authenticate.ts'
import { dashboard, refresh } from './app/dashboard.ts'

// Auth routes
const authRouter = express.Router()
authRouter.post('/login', login)
authRouter.post('/register', register)


// User routes
const dashRouter = express.Router()
dashRouter.get('/', dashboard)
dashRouter.get('/refresh', refresh)

export { authRouter, dashRouter }
