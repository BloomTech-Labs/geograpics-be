const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require('dotenv').config()

// swagger
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express');


const tokenCheck = require('../middleware/auth-middleware')

// routers
const userRouter = require("../router_User/userRouter");
const pictureRouter = require("../router_Pictures/pictureRouter");
const authRouter = require("../router_Auth/authRouter")

//express
const server = express();

// swagger setup
const swaggerDefinition = {
  info: {
    title: 'Geograpics API',
    version: '1.0.0',
    description: 'Endpoints to access All Resources',
  },
  host: 'geograpics.herokuapp.com',
  basePath: '/',
  securityDefinitions: {
      JWT: {
        type: 'apiKey',
        name: 'authorization',
        description: 'JWT authorization of an API',
        scheme: 'bearer',
        in: 'header',
      },
      // OAuth2: {
      //   type: 'oauth2',
      //   description: 'Authentication through Instagram',
      //   flows: {
      //     implicit: {
      //       authorizationUrl: "https://www.geograpics.com/auth/instagram",
      //       // scopes: {
      //       //   "write:pets": "modify pets in your account",
      //       //   "read:pets": "read your pets"
      //       // }
      //     },
      //     authorizationCode: {
      //       authorizationUrl: "https://example.com/api/oauth/dialog",
      //       tokenUrl: "https://example.com/api/oauth/token",
      //       // scopes: {
      //       //   write:pets: "modify pets in your account",
      //       //   read:pets: "read your pets"
      //       // }
      //     }
      //   }
      // }
  },
  schemes: ['https']
}

const options = {
swaggerDefinition,
// apis: ['/**./*.js']
apis: ['./yaml-api/*.yaml']
};

const swaggerSpec = swaggerJSDoc(options)


// passport
const passport = require('passport')

server.use(express.json());
server.use(helmet());
server.use(cors());

// From here to end, all boilerplate code to get passport to work
// Source: https://dev.to/aurelkurtula/working-with-instagram-api-and-passportjs-in-a-node-application--5068
server.use(express.static(__dirname + "/public"));

server.set("view engine", "pug");

// End passport setup

server.use("/users", tokenCheck, userRouter);
server.use("/map", tokenCheck, pictureRouter);
server.use("/auth", authRouter)

server.get("/", (req, res) => {
  res.send("Welcome to Our Server (Geograpics)");
});

server.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
})

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


module.exports = server;
