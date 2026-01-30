import z from 'zod'
import { prisma } from '../../prisma/prisma.ts'
import { postSchema } from '../../prisma/schemas.ts'

export const createPost = async (data: z.infer<typeof postSchema>) => {
    try {
        const post = await prisma.post.create({ data })
        return post
    } catch (error) {
        console.log(error)
        return Promise.reject(error)
    }
}

export const getPost = async (id: number) => {
    try {
        const post = await prisma.post.findUnique({ 
            where: { 
                id 
            }, 
            select: {
                id: true,
                title: true,
                content: true,
                authorId: true,
            }
        })
        return post
    } catch (error) {
        console.log(error)
        return Promise.reject(error)
    }
}

export const getPosts = async () => {
    try {
        const posts = await prisma.post.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                authorId: true,
            }
        })
        return posts
    } catch (error) {
        return Promise.reject(error)
    }
}