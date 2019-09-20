const express = require("express");
const router = express.Router();
require("dotenv").config();
const helper = require("../router_User/userHelper");
const gentoken = require("../security/gen-token");

// server route = /auth

//InstaPassport
const passport = require("passport");
const InstStrategy = require("passport-instagram").Strategy;

// passport.serializeUser(function(userInfo, done) {
//   done(null, userInfo);
// });

// passport.deserializeUser(function(userInfo, done) {
//   // helper.findUserById(id)
//   //   .then(user => {
//   //     done(null, user)
//   //   })
//   //   .catch(err => {
//   //     console.log(err)
//   //   })
//   done(null, userInfo)
// })

passport.use(
  new InstStrategy(
    {
      clientID: process.env.INSTACLIENT,
      clientSecret: process.env.INSTASECRET,
      callbackURL:
        "http://localhost:8000/auth/instagram/callback"
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
        console.log(user.id);
        console.log(req.user.insta_id);
        // If user exists, the insta_id on the req body will match the insta_id from the users table
        if (user.insta_id === req.user.insta_id) {
          res.redirect(
            `https://staging.geograpics.com/register/2?token=${token}&username=${req.user.username}&userid=${user.id}`
          );
        }
      })
      .catch(err => {
        // If user does not exist in the users table, they're automatically added by helper.postNewUser
        // This works because this is only triggered after Instagram & passport verify the user - they wouldn't hit 
        // this function unless they were already an Instagram user
        helper
          .postNewUser(req.user)
          .then(newUserID => {
            console.log(newUserID)
            res.status(200).json(newUserID)
            // res.redirect(
            //   `https://staging.geograpics.com/register/2?token=${token}&username=${req.user.username}&userid=${newUserID}`
            // );
          })
          .catch(err => {
            console.log(err);
            res.status(401).json({ message: "Could Not Add User" });
          });
      });
  }
);

module.exports = router
