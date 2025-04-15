const express = require("express");
const { default: helmet } = require("helmet");
const cors = require("cors");
const path = require('path');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const authRouter = require("./routers/authRouter.js");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const app = express();

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
        url: "/", // Use relative root URL to work in any environment
        description: "Default Server"
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
    },
    basePath: "/", // Set base path to root
    schemes: ["https", "http"]
  },
  apis: ['./routers/*.js'] // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Serve swagger UI files
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    url: "/api-docs/swagger.json", // Use relative URL for the Swagger JSON
    docExpansion: 'none',
    persistAuthorization: true
  }
}));

// Create endpoint for swagger.json
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});

// Ensure all other routes work correctly
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello from express server!!!!" });
  console.log("Hello print from express server");
});

app.listen(process.env.PORT, () => {
  console.log("Listening . . . .  ");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database Connected . . . ");
  })
  .catch((error) => {
    console.log("Database connection failed . . . ", error);
  });
