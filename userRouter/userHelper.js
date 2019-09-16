const db = require("../data/config")

module.exports = {
    findAllUsers,
    postNewUser
}

// Retrieve all users from user table
function findAllUsers () {
    return db("users")
}

// Insert new user into user table
function postNewUser (newUserInfo) {
    return db("users").insert(newUserInfo)
}