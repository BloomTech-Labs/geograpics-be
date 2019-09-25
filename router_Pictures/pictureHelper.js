const db = require("../data/config");

module.exports = {
  findAllPictures,
  postNewPictureInfo,
  editPicture,
  deletePicture,
  getPictures,
  getPicsWithUserInfo
};

// Retrieve all pictures from user table
function findAllPictures() {
  return db("pictures");
}

// Retrieve all pictures for Certain user
function getPictures(userId) {
  return db("pictures").where("user_id", userId);
}

//Retrieve all pictures and nested userObject
function getPicsWithUserInfo() {

}

// Insert new picture into user table
function postNewPictureInfo(newPictureInfo) {
  return db("pictures").insert(newPictureInfo)
}

function editPicture(userID, changePicture) {
  return db("pictures")
    .where({ user_id: userID })
    .update(changePicture);
}

function deletePicture(userID) {
  return db("pictures")
    .where({ user_id: userID })
    .del();
}