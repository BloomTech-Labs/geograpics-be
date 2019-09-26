const db = require("../data/config");
const axios = require('axios');

module.exports = {
  findAllPictures,
  postNewPictureInfo,
  editPicture,
  deletePicture,
  getPictures,
  getPicsWithUserInfo,
  instaExport
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

async function instaExport (accessCode, userId) {
  return await axios.get(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${accessCode}`)
  .then(resFromInstagram => {
    // Formats incoming data from instagram into a shape our db can use
    let data = resFromInstagram.data.data;
    return data.map(picture => {
      return (newPicObject = {
        media_id: picture.id,
        user_id: userId,
        // Instagram API omits picture.location *entirely* if there's no location data
        // This inserts picture.location so it doesn't break the code
        longitude: picture.location ? picture.location.longitude : null,
        latitude: picture.location ? picture.location.latitude : null,
        thumbnail: picture.images.thumbnail.url,
        standard_resolution: picture.images.standard_resolution.url,
        created_time: picture.created_time,
        caption: picture.caption.text,
        likes: picture.likes.count
      });
    });
  })
  .catch( err => console.log(err) );    
}