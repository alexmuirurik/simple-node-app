import express from 'express'
import { authenticate, forgotPassword, login, register, resetPassword, unless } from './app/authenticate.ts'
import { dashboard, refresh } from './app/dashboard.ts'
import { getuser, getusers } from './app/users.ts'
import { getpost, getposts } from './app/posts.ts'
import { cacheMiddleware } from './app/cache.ts'

// Auth routes
const authRouter = express.Router()
authRouter.post('/login', login)
authRouter.post('/register', register)
authRouter.post('/forgot-password', forgotPassword)
authRouter.post('/reset-password', resetPassword)


// Dash routes
const dashRouter = express.Router()
dashRouter.use(unless('/api/v1/auth', authenticate))
dashRouter.get('/', dashboard)
dashRouter.get('/refresh', refresh)


// User routes
dashRouter.get('/user/:email', getuser)
dashRouter.get('/users', getusers)


// Post routes
dashRouter.get('/posts/:id', getpost)
dashRouter.get('/posts', cacheMiddleware, getposts)


export { authRouter, dashRouter }
