const express = require("express");
const session = require("express-session");
const axios = require("axios");
require('dotenv').config()

const cors = require("cors");
const helmet = require("helmet");
const tokenCheck = require('../middleware/auth-middleware')

//session
const sessionConfig = require('../config/session-config')

const userRouter = require("../router_User/userRouter");
const pictureRouter = require("../router_Pictures/pictureRouter");
const authRouter = require("../router_Auth/authRouter")

//express
const server = express();

// passport
const passport = require('passport')

server.use(express.json());
server.use(helmet());
server.use(cors());

// From here to end, all boilerplate code to get passport to work
// Source: https://dev.to/aurelkurtula/working-with-instagram-api-and-passportjs-in-a-node-application--5068
server.use(express.static(__dirname + "/public"));

server.set("view engine", "pug");

server.use(session(sessionConfig));

server.use(passport.initialize())
server.use(passport.session())

// End passport setup

server.use("/users", tokenCheck, userRouter);
server.use("/map", tokenCheck, pictureRouter);
server.use("/auth", authRouter)

server.get("/", (req, res) => {
  res.send("Welcome to Our Server (Geograpics)");
});



module.exports = server;
