import express from "express";
import dotEnv from 'dotenv'
import adminRouter from './router/admin.js'
import logger from 'morgan'
dotEnv.config()

const server = express()
const app = express.Router();

const appConfig = {
    port: process.env.PORT || 5000,
    name:"question server",
    baseUrl:"/"
}

app.use(express.json())
app.use(logger('dev'))

app.use('/admin',adminRouter)

server.use(appConfig.baseUrl,app)
server.listen(appConfig.port, () => {
    console.log('Server running');
})


