const express = require("express");
const session = require("express-session");
const passport = require("passport");
const instagram = require("passport-instagram");
const axios = require("axios");

const cors = require("cors");
const helmet = require("helmet");

const userRouter = require("../userRouter/userRouter");
const pictureRouter = require("../picturesRouter/pictureRouter");

//express
const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(express.static(__dirname + "/public"));
server.set("view engine", "pug");

server.use("/users", userRouter);
server.use("/map", pictureRouter);

server.get("/", (req, res) => {
  res.send("Welcome to Our Server (Geograpics)");
});
server.get("/login", (req, res) => {
  res.render("login");
});

module.exports = server;
