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
    const token = gentoken(req.user);
    // helper.findUserById queries db to check and see if user exists
    helper
      .findUserById(req.user.insta_id)
      // If user is found, user object return is that users entire row from the users table
      .then(user => {
        // If user exists, the insta_id on the req body will match the insta_id from the users table
        // and redirect them to the dashboard
        if (user.insta_id === req.user.insta_id) {
          res.redirect(
            `https://staging.geograpics.com/dashboard?token=${token}&username=${req.user.username}&userid=${user.id}`
          );
        }
      })
      .catch(err => {
        // If user does not exist in the users table, they're automatically added by helper.postNewUser
        // This works because this is only triggered after Instagram & passport verify the user - they wouldn't hit
        // this function unless they were already an Instagram user

        //  Problem: Front end needs the newUserID/primary key
        // SQLite3 by default returns the newUser's primary key ID, but postgres doesn't,
        // it sends back an object-object full of data about what the server just did, such as SQL Inster,
        // number of rows added, and date of addition - generally useless

        //  So for a postgress db, a second db call is needed to find the newUser & return their userID, which front-end needs
        helper
          .postNewUser(req.user)
          .then(newUserID => {
            helper
              .findUserById(req.user.insta_id)
              .then(newUser => {
                res.redirect(
                  `https://staging.geograpics.com/register/2?token=${token}&username=${req.user.username}&userid=${newUser.id}`
                );
              })
              .catch(err => {
                res.status(500).json({
                  Error: "Added user, but could not find them in the database"
                });
              });
          })
          .catch(err => {
            res.status(401).json({ message: "Could Not Add User" });
          });
      });
  }
);

module.exports = router;
