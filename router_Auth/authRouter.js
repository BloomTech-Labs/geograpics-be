const express = require("express");
const router = express.Router()
require('dotenv').config()
const helper = require("../router_User/userHelper");
const gentoken = require('../security/gen-token')

// server route = /auth

//InstaPassport
const passport = require('passport')
const InstStrategy = require('passport-instagram').Strategy

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
      callbackURL: 'https://geograpics-staging.herokuapp.com/auth/instagram/callback'
    },
    (accessToken, refreshToken, profile, done) => {

      let userInfo = {
        insta_id: profile._json.data.id,
        username: profile._json.data.username,
        profile_pic: profile._json.data.profile_picture,
        full_name: profile._json.data.full_name,
        bio: profile._json.data.bio,
        website: profile._json.data.website,
        is_business: profile._json.data.is_business,
        access_token: accessToken
      }

      done(null, userInfo)
    }
  )
);


router.get('/instagram', passport.authenticate('instagram'))


router.get('/instagram/callback', passport.authenticate('instagram', { session: false }), (req, res) => {

  const token = gentoken(req.user)

  helper.findUserById(req.user.insta_id)
    .then(user => {
      console.log(user.id)
      console.log(req.user.insta_id)

      if (user.insta_id === req.user.insta_id) {
        res.redirect(`https://staging.geograpics.com?token=${token}&username=${req.user.username}&userid=${user.id}`)
      } 
    })
    .catch(err => {
      helper.postNewUser(req.user)
        .then(newUserID => {
          res.redirect(`https://staging.geograpics.com?token=${token}&username=${req.user.username}&userid=${newUserID}`)
        })
        .catch(err => {
          console.log(err)
          res.status(401).json({ message: "Could Not Add User" })
        })
    })
})

module.exports = router
