const db = require("../data/config")

module.exports = {
    findAllPictures,
    postNewPictureInfo,
    editPicture,
    deletePicture
}

// Retrieve all users from user table
function findAllPictures () {
    return db("pictures")
}

// Insert new user into user table
function postNewPictureInfo (newPictureInfo) {
    return db("pictures").insert(newPictureInfo)
}

function editPicture (picID, changePicture) {
    return db("pictures").where({id: picID}).update(changePicture)
}

function deletePicture (picID) {
    return db("pictures").where({id: picID}).del()
}