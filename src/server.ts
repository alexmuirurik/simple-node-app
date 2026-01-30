import express from 'express'
import favicon from 'serve-favicon'
import fs from 'fs'
import cors from 'cors'
import { authRouter, dashRouter } from './routes.ts'

const app = express()

app.use(favicon(fs.readFileSync('public/favicon.ico')))
app.use(express.static('public'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1', dashRouter)

app.use('*url', (req: express.Request, res: express.Response) => {
    res.json({
        message: 'Not found'
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
