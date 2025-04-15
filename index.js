const express = require('express')
const { default: helmet } = require('helmet')
const cors = require('cors')
const cookieParser = require("cookie-parser")
const mongoose = require('mongoose')

const authRouter = require('./routers/authRouter.js')

const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUI = require("swagger-ui-express")


const app = express()

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: "Auth API",
        version: "1.0.0",
        description: "Authentication API documentation"
      },
      servers: [
        {
          url: "http://localhost:" + (process.env.PORT || 3000)
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      }
    },
    apis: ['./routers/*.js'] // Points to all router files
  };

const swaggerDocs = swaggerJsDoc(swaggerOptions)

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

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


