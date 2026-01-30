import { getUser, getUsers } from '../actions/user.ts'
import express from 'express'

export const getuser = async (req: express.Request, res: express.Response) => {
    try {
        const user = await getUser(req.app.locals.user.id)
        return res.json(user)
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const getusers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers()
        return res.json(users)
    } catch (error) {
        return res.status(400).json({ error })
    }
}
