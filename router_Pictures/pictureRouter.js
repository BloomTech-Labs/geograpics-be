const express = require("express");
const router = express.Router();
const helper = require("./pictureHelper");
const userHelper = require("../router_User/userHelper");

// server route = /map

// Call to db to retrieve user pictures
router.get("/", async (req, res) => {
  loggedInUsername = req.loggedInUsername;
  try {
    const user = await userHelper.findUserByUsername(loggedInUsername);
    delete user.access_token
    const pictures = await helper.getPictures(user.id);
    const nested = { ...user, pictures: pictures };
    if (user.length === 0) {
      res.status(404).json({ message: "Failed to find user" });
    } else {
      res.status(200).json(nested);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve pictures" });
  }
})

// updates db with new Instagram data - doesn't delete
router.get("/update", async (req, res) => {
  loggedInUsername = req.loggedInUsername;
  try {
    const user = await userHelper.findUserByUsername(loggedInUsername);
    const accesscode = user.access_token;
    delete user.access_token;
    // get new photos from instagram
    const picFromInst = await helper.instaImport(accesscode, user.id);
    // get existing photos from db
    const userPhotos = await helper.getPictures(user.id);
    // runs if user is new and has nothing in Pictures table
    if (userPhotos.length === 0) {
      const lastIndex = await helper.postNewPictureInfo(picFromInst);
      res.status(201).json({
        message: "Photos Added To DB",
        ...user,
        pictures: picFromInst
      });
    }
    // Runs if user has data in Pictures Table
    else {
      // Problem: How to compare data coming from Instagram to data in our database?
      // Multiple solutions from different team members:

      // One line solution: .find locates photos from Instagram that match our database.  The "!" flags it as false, so filter kicks it out
      // const latestPhotos = picFromInst.filter(pic1 => !userPhotos.find(photo => pic1.media_id === photo.media_id))

      // Verbose solution: findIndex returns -1 if id's match, gets kicked out
      const latestPhotos = picFromInst.filter(picture => {
        let evalDB = userPhotos.findIndex(
          pic => pic.media_id === picture.media_id
        );
        if (evalDB < 0) return picture;
      })

      // If no new photos on Instagram:
      if (latestPhotos.length === 0) {
        res
          .status(200)
          .json({
            message: "There are No Photos to Update",
            ...user,
            pictures: userPhotos
          });
      }
      // If user has new photos on Instagram that aren't in the database
      else {
        const lastIndex2 = await helper.postNewPictureInfo(latestPhotos);
        res
          .status(201)
          .json({
            message: "User's Latest Photos From Instagram",
            ...user,
            pictures: latestPhotos
          });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve pictures" });
  }
});

// Insert new picture into DB
// sends new picture ID back

// Currently unused----

// router.post("/", (req, res) => {
//   let newPictureInfo = req.body;
//   helper
//     .postNewPictureInfo(newPictureInfo)
//     .then(newPicture => {
//       res.status(200).json(newPicture);
//     })
//     .catch(error => {
//       res.status(500).json({ Error: "Failed to add new picture info" });
//     });
// });

// Currently un-used----

// router.put("/:id", (req, res) => {
//   let id = req.params.id;
//   let editInfo = req.body;
//   helper
//     .editPicture(id, editInfo)
//     .then(edited => {
//       res.status(200).json(edited);
//     })
//     .catch(error => {
//       res.status(500).json({ Error: "Failed to edit picture" });
//     });
// });

// Refresh/Sync with Instagram
router.delete("/refresh", async (req, resDelToClient) => {
  loggedInUsername = req.loggedInUsername;

  try {
    // search users table by Insta username (done)
    const user = await userHelper.findUserByUsername(loggedInUsername);
    // Wipes existing picture table for user
    const deleted = await helper.deletePicture(user.id);
    // get accesscode for user
    const accesscode = user.access_token;
    // api to Instagram endpoint w/access code
    const pictures = await helper.instaImport(accesscode, user.id);
    // send pictures in format front end wants
    const lastIndex = await helper.postNewPictureInfo(pictures);
    // send to client
    resDelToClient.status(200).json({ ...user, pictures: pictures });
  } catch (err) {
    resDelToClient.status(500).json({ message: "Failed to retrieve pictures" });
  }
});

module.exports = router;
