const express = require('express')
const { default: helmet } = require('helmet')
const cors = require('cors')
const cookieParser = require("cookie-parser")
const mongoose = require('mongoose')

const authRouter = require('./routers/authRouter.js')


const app = express()

app.use(cors())
app.use(helmet());
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use('/api/auth', authRouter)


app.get('/', (req, res) => {
    res.json({message: "Hello from express server!!!!"})
    console.log("Hello print from express server")
})

app.listen(process.env.PORT, ()=>{
    console.log("Listening . . . .  ")
})



mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database Connected . . . ")
}).catch((error) => {
    console.log("Database connection failed . . . ", error)
})


