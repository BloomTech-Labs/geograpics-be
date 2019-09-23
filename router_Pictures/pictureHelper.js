const db = require("../data/config");

module.exports = {
  findAllPictures,
  postNewPictureInfo,
  editPicture,
  deletePicture,
  getPictures
};

// Retrieve all pictures from user table
function findAllPictures() {
  return db("pictures");
}

// Retrieve all pictures for Certain user
function getPictures(userId) {
  return db("pictures").where("user_id", userId);
}

// Insert new picture into user table
function postNewPictureInfo(newPictureInfo) {
  return db("pictures").insert(newPictureInfo);
}

function editPicture(picID, changePicture) {
  return db("pictures")
    .where({ id: picID })
    .update(changePicture);
}

function deletePicture(picID) {
  return db("pictures")
    .where({ id: picID })
    .del();
}
