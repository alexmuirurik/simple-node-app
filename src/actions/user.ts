import z from 'zod'
import { prisma } from '../../prisma/prisma.ts'
import { userSchema } from '../../prisma/schemas.ts'

export const createUser = async (data: z.infer<typeof userSchema>) => {
    try {
        const user = await prisma.user.create({ data })
        return user
    } catch (error) {
        console.log(error)
        return Promise.reject(error)
    }
}

export const getUser = async (id: number) => {
    try {
        const user = await prisma.user.findUnique({ 
            where: { 
                id 
            }, 
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
            }
        })
        return user
    } catch (error) {
        console.log(error)
        return Promise.reject(error)
    }
}

export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({ 
            where: { 
                email 
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                password: true,
            }
        })
        return user
    } catch (error) {
        return Promise.reject(error)
    }
}

export const getUsers = async () => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
            }
        })
        return users
    } catch (error) {
        return Promise.reject(error)
    }
}

export const updateUser = async (id: number, data: any) => {
    try {
        const user = await prisma.user.update({ where: { id }, data })
        return user
    } catch (error) {
        return Promise.reject(error)
    }
}

export const deleteUser = async (id: number) => {
    try {
        const user = await prisma.user.delete({ where: { id } })
        return user
    } catch (error) {
        return Promise.reject(error)
    }
}
