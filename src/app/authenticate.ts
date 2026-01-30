import jwt from 'jsonwebtoken'
import express from 'express'
import bcrypt from 'bcrypt'
import { createUser, getUserByEmail, updateUser } from '../actions/user.ts'
import { User } from '../../prisma/generated/prisma/client.ts'

const secretKey = process.env.JWT_SECRET

export const unless = (url: string, middleware: express.RequestHandler) => {
    return (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (req.originalUrl.startsWith(url)) {
            next()
        } else {
            middleware(req, res, next)
        }
    }
}

export const authenticate = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const token = req.headers['authorization']

        if (token == null) {
            throw new Error('No token provided')
        }

        jwt.verify(token, secretKey, async (err, user) => {
            if (err) {
                return res.status(401).json({ error: err })
            }

            if (!user) {
                return res.status(401).json({ error: 'Invalid token' })
            }

            const { email } = user as User

            if (!email) {
                return res.status(401).json({ error: 'Invalid token' })
            }

            const dbUser = await getUserByEmail(email)
            if (!dbUser) {
                return res.status(401).json({ error: 'Invalid token' })
            }

            req.app.locals.user = dbUser
            next()
        })
    } catch (error) {
        return res.status(401)
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.json('Email and password are required')
        }

        const user = await getUserByEmail(email)
        if (!user) {
            throw new Error('Invalid email or password')
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            throw new Error('Invalid email or password')
        }

        const token = jwt.sign(
            {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            },
            secretKey,
            {
                expiresIn: '1h'
            }
        )
        return res.json({ message: 'Login successful', token })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error })
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, firstName, lastName } = req.body
        if (!email || !password || !firstName || !lastName) {
            throw new Error(
                'Email, password, firstName and lastName are required'
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await createUser({
            email,
            password: hashedPassword,
            firstName,
            lastName
        })

        if (!user) {
            throw new Error('User could not be created')
        }

        return res.json({ message: 'Register successful' })
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const forgotPassword = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { email } = req.body
        if (!email) {
            throw new Error('Email is required')
        }

        const user = await getUserByEmail(email)
        console.log(user)
        if (!user) {
            throw new Error('Invalid email')
        }

        const token = jwt.sign(
            {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            },
            secretKey,
            {
                expiresIn: '1h'
            }
        )

        return res.json({ message: 'Password reset email sent', token })
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const resetPassword = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { token, password } = req.body
        if (!token || !password) {
            throw new Error('Token and password are required')
        }

        const decodedToken = jwt.verify(token, secretKey) as {
            id: number
            firstName: string
            lastName: string
            email: string
        }

        const user = await getUserByEmail(decodedToken.email)
        if (!user) {
            throw new Error('Invalid token')
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            throw new Error('Invalid password')
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await updateUser(user.id, {
            ...user,
            password: hashedPassword
        })

        if (!newUser) {
            throw new Error('Password could not be updated')
        }

        return res.json({ message: 'Password updated successfully' })
    } catch (error) {
        return res.status(400).json({ error })
    }
}
