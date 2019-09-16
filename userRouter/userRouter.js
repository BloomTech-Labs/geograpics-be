const express = require("express");
const router = express.Router();
const helper = require("./userHelper")

// Retrieve list of all users
// Comment out before production
router.get("/", (req, res)=>{
    helper.findAllUsers()
    .then(users=>{
        res.status(200).json(users)
    })
    .catch(error=>{
        res.status(500).json({Error: "Error"})
    })
})

// Insert new user into DB
router.post("/", (req, res)=>{
    let newUserInfo = req.body
    helper.postNewUser(newUserInfo)
    .then(newUser=>{
        res.status(200).json(newUser)
    })
    .catch(error=>{
        res.status(500).json({Error: "Error"})
    })
})



module.exports = router