const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

//express
const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());


server.get('/', (req, res) => {
    res.send("Welcome to Our Server (Geograpics)")
  })
  



module.exports = server;