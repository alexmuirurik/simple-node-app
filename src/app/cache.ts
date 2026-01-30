import express from 'express'

const cache = new Map()

export const cacheMiddleware = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const key = req.originalUrl
    if (cache.has(key)) {
        console.log(`Cache hit for ${key}`)
        return res.send(cache.get(key))
    }

    // Override res.send to cache the response body
    const originalSend = res.send.bind(res)
    res.send = (body) => {
        console.log(`Caching response for ${key}`)
        cache.set(key, body)
        originalSend(body)
        return res
    }
    
    next()
}
