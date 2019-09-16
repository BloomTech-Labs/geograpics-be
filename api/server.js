const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
//const authRouter = require("../authRouter/authRouter")
const userRouter = require("../userRouter/userRouter")

//express
const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json())
//server.use("api/authRouter", authRouter)
server.use("/users", userRouter)


server.get('/', (req, res) => {
    res.send("Welcome to Our Server (Geograpics)")
  })
  



module.exports = server;