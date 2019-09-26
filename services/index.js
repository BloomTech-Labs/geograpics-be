const axios = require('axios');

module.exports = {
    instaExport
};

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
          // This inserts picture.location w/ "absent" so it doesn't break the code
          longitude: picture.location ? picture.location.longitude : null,
          longitude: picture.latitude ? picture.location.latitude : null,
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