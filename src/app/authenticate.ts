import jwt from 'jsonwebtoken'
import express from 'express'
import bcrypt from 'bcrypt'
import { createUser, getUserByEmail } from '../actions/user.ts'
import { User } from '../../prisma/generated/prisma/client.ts'

const secretKey = process.env.JWT_SECRET

export const authenticate = (
    req: express.Request & { user: User | undefined },
    res: express.Response,
    next: express.NextFunction
) => {
    const token = req.headers['authorization']
    if (token == null) {
        return res.sendStatus(401)
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }

        req.user = user as User
        console.log(req.user)
        next()
    })
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            throw new Error('Email and password are required')
        }

        const user = await getUserByEmail(email)
        if (!user) {
            throw new Error('Invalid email or password')
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.json({ message: 'Invalid email or password' })
        }

        const token = jwt.sign(
            {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName
            },
            secretKey,
            {
                expiresIn: '1h'
            }
        )
        return res.json({ message: 'Login successful', token })
    } catch (error) {
        return res.status(402).json({ error })
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
        return res.json({ error })
    }
}
