const express = require("express");
const session = require("express-session");
const passport = require("passport");
const instagram = require("passport-instagram");
const instagramStrategy = instagram.Strategy;
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

// From here to end, all boilerplate code to get passport to work
// Source: https://dev.to/aurelkurtula/working-with-instagram-api-and-passportjs-in-a-node-application--5068
server.use(express.static(__dirname + "/public"));

server.set("view engine", "pug");

server.use(
  session({
    // Tribute to creator of Lupin the Third
    name: "Monkey Punch",
    secret:
      process.env.PASSPORT_SECRET || "Be more like Goemon, and just shut up",
    resave: false,
    saveUninitialized: true
  })
);

server.use(passport.initialize());
server.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new instagramStrategy(
    {
      clientID: "...",
      clientSecret: "...",
      callbackURL: "http://localhost:3000/auth/instagram/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

// End passport setup

server.use("/users", userRouter);
server.use("/map", pictureRouter);

server.get("/", (req, res) => {
  res.send("Welcome to Our Server (Geograpics)");
});
server.get("/login", (req, res) => {
  res.render("login");
});

module.exports = server;
