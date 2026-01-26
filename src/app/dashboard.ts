import express from 'express'
import jwt from 'jsonwebtoken'
import { getUserByEmail } from '../actions/user.ts'
import { User } from '../../prisma/generated/prisma/client.ts'

export const dashboard = (req: express.Request, res: express.Response) => {
    res.json({ message: 'Dashboard successful' })
}

export const refresh = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const newReq = req as express.Request & { user: User | undefined }
        const secretKey = process.env.JWT_SECRET
        if (!newReq.user) {
            throw new Error('User not found')
        }

        const dbUser = await getUserByEmail(newReq.user?.email)

        const token = jwt.sign(
            {
                id: dbUser?.id,
                firstName: dbUser?.firstName,
                lastName: dbUser?.lastName
            },
            secretKey,
            {
                expiresIn: '1h'
            }
        )
        return res.json({ token: token })
    } catch (error) {
        return res.status(402).json({ error })
    }
}
