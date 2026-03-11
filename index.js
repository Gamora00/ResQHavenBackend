const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const database = require('./database')

const auth = require('./auth/post')
const get = require('./fetch/get')


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://res-q-haven-page.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use('/auth', auth)
app.use('/', get)

app.listen(5000,()=>{{
    console.log("server running on 5000 port");
    
}})