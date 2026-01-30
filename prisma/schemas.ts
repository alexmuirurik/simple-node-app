import z from 'zod'

export const userSchema = z.object({
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
})

export const postSchema = z.object({
    authorId: z.number(),
    title: z.string(),
    content: z.string(),
    published: z.boolean()
})

export const commentSchema = z.object({
    content: z.string()
})

export const likeSchema = z.object({
    emoji: z.string()
})
