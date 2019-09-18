const db = require("../data/config")

module.exports = {
    findAllUsers,
    postNewUser,
    editUser,
    deleteUser,
    findUserById
}

// Retrieve all users from user table
function findAllUsers () {
    return db("users")
}

function findUserById (id) {
    return db("users")
        .where('id', id)
        .first()
}

// Insert new user into user table
function postNewUser (newUserInfo) {
    return db("users").insert(newUserInfo)
}

function editUser (userid, changeUser) {
    return db("users").where({id: userid}).update(changeUser)
}

function deleteUser (userid) {
    return db("users").where({id: userid}).del()
}