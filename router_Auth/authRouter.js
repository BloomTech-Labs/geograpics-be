const express = require("express");
const router = express.Router();
require("dotenv").config();
const helper = require("../router_User/userHelper");
const gentoken = require("../security/gen-token");

// server route = /auth

//InstaPassport
const passport = require("passport");
const InstStrategy = require("passport-instagram").Strategy;

passport.use(
  new InstStrategy(
    {
      clientID: process.env.INSTACLIENT,
      clientSecret: process.env.INSTASECRET,
      callbackURL: process.env.CALLBACKURL
    },
    (accessToken, refreshToken, profile, done) => {
      // Changing data object returned by Instagram into something our db can understand
      let userInfo = {
        insta_id: profile._json.data.id,
        username: profile._json.data.username,
        profile_pic: profile._json.data.profile_picture,
        full_name: profile._json.data.full_name,
        bio: profile._json.data.bio,
        website: profile._json.data.website,
        is_business: profile._json.data.is_business,
        access_token: accessToken
      };

      done(null, userInfo);
    }
  )
);

// Initial entry point of passport
router.get("/instagram", passport.authenticate("instagram"));

// Where passport throws all requests
// After Instagram login, user goes through this endpoint
router.get(
  "/instagram/callback",
  passport.authenticate("instagram", { session: false }),
  (req, res) => {
    let reqUser = (process.env.DEMO_INSTA_ID && process.env.DEMO_USERNAME)
      ? { insta_id: process.env.DEMO_INSTA_ID, username: process.env.DEMO_USERNAME }
      : req.user;
    const token = gentoken(reqUser);
    // helper.findUserById queries db to check and see if user exists
    helper
      .findUserById(reqUser.insta_id)
      // If user is found, user object return is that users entire row from the users table
      .then(user => {
        // If user exists, the insta_id on the req body will match the insta_id from the users table
        // and redirect them to the front end dashboard
        if (user.email) {
          res.redirect(
            `${process.env.FRONTENDURL}/preloader?token=${token}&username=${reqUser.username}&userid=${user.id}&inDatabaseHaveEmail=true`
          )
        // If user exists but doesn't have email, redirect to preloader, set to register/2 on front end
        }else{
          res.redirect(
            `${process.env.FRONTENDURL}/preloader?token=${token}&username=${reqUser.username}&userid=${user.id}&inDatabaseHaveEmail=false`
          );
        }
      })

        // If user does not exist in the users table, they're automatically added by helper.postNewUser

        //  Problem: Front end needs the newUserID/primary key
          // SQLite3 by default returns the newUser's primary key ID, but postgres doesn't,
          // it sends back an object-object full of data about what the server just did, such as SQL Insert,
          // number of rows added, and date of addition - generally useless

      .catch(err => {
        //  Solution: So for a postgress db, a second db call is needed to find the newUser & return their userID, which front-end needs
        helper
          .postNewUser(req.user)
          .then(newUserID => {
            helper
              .findUserById(req.user.insta_id)
              .then(newUser => {
                res.redirect(
                  `${process.env.FRONTENDURL}/preloader?token=${token}&username=${req.user.username}&userid=${newUser.id}&inDatabaseHaveEmail=false`
                );
              })
              .catch(err => {
                res.status(500).json({
                  Error: "Added user, but could not find them in the database"
                });
              });
          })
          //If this is hit, attempted to add user, but could not add. User was originally not in the DB otherwise .catch() on line 66 would not have triggered
          .catch(err => {
            res.status(401).json({ message: "Could Not Add User" });
          });
      });
  }
);

module.exports = router;
