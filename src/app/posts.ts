import { getPost, getPosts } from '../actions/post.ts'
import express from 'express'

export const getpost = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ error: 'Invalid id' })
        }

        const post = await getPost(Number(id))
        return res.json(post)
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const getposts = async (req: express.Request, res: express.Response) => {
    try {
        const posts = await getPosts()
        return res.json(posts)
    } catch (error) {
        return res.status(400).json({ error })
    }
}