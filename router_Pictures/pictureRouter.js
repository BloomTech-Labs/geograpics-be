const express = require("express");
const router = express.Router();
const helper = require("./pictureHelper");
const userHelper = require("../router_User/userHelper");
const axios = require('axios')

// server route = /map

router.get("/",  async (req, resToClient) => {
  loggedInUsername = req.loggedInUsername;

  try {
    // search users table by Insta username (done)
    const user = await userHelper.findUserByUsername(loggedInUsername)

    // get accesscode for user 
    const accesscode = user.access_token

    // api to Instagram endpoint w/access code
      axios.get(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${accesscode}`)
        .then(resFromInstagram => {
  
          let data = resFromInstagram.data.data
          const newPictureArray = data.map(picture => {
            return newPicObject = {
              media_id: picture.id,
              user_id: user.id,
              longitude: !picture.location ? 'absent': picture.location.longitude,
              latitude: !picture.location ? 'absent' : picture.location.latitude,
              thumbnail: picture.images.thumbnail.url,
              standard_resolution: picture.images.standard_resolution.url,
              created_time: picture.created_time,
              caption: picture.caption.text,
              likes: picture.likes.count
            }
          })

          const filteredArray = newPictureArray.filter(picture => picture.longitude !== 'absent')

          if (filteredArray.length === 0){
            resToClient.status(400).json({message: "User Doesn't Have any Geo-Location Data --- Sorry!"})
          } 
          else {
              // insert pic data into Picture Table 
              helper.postNewPictureInfo(filteredArray)
              .then (value => {
                console.log(value)
                resToClient.status(201).json({...user, pictures: filteredArray})
              })
              .catch(err => {
                console.log(err)
                resToClient.status(400).json({message: "Failure", user, filteredArray})
              })
          }
        })
        .catch(err => {
          console.log(err)
        })


    // const pictures = await helper.getPictures(user.id)
    // const nested = {...user, pictures: pictures}

    // if(user.length === 0) {
    //   res.status(404).json({ message: "Failed to find user"})
    // } else {
    //     res.status(200).json(nested)
    // }

  } catch (err) {
    resToClient.status(500).json({ message: "Failed to retrieve pictures" })
  }


});

// Insert new picture into DB
// sends new picture ID back
router.post("/", (req, res) => {
  let newPictureInfo = req.body;
  helper
    .postNewPictureInfo(newPictureInfo)
    .then(newPicture => {
      res.status(200).json(newPicture);
    })
    .catch(error => {
      res.status(500).json({ Error: "Failed to add new picture info" });
    });
});

// Edit picture info - ALL picture info, must fill in all fields
// regardless if they change or not
//  picture id sent in URL parameter
// picture data sent in body
router.put("/:id", (req, res) => {
  let id = req.params.id;
  let editInfo = req.body;
  helper
    .editPicture(id, editInfo)
    .then(edited => {
      res.status(200).json(edited);
    })
    .catch(error => {
      res.status(500).json({ Error: "Failed to edit picture" });
    });
});

// Delete picture - id must be in URL parameter string
router.delete("/:id", (req, res) => {
  let id = req.params.id;
  helper
    .deletePicture(id)
    .then(deleted => {
      res.status(201).json(deleted);
    })
    .catch(error => {
      res.status(500).json({ Error: "Failed to delete picture" });
    });
});

module.exports = router;
