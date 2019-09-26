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
    const pictures = await helper.getPictures(user.id);
    const nested = { ...user, pictures: pictures };

    if (user.length === 0) {
      res.status(404).json({ message: "Failed to find user" });
    } 
    else {
      res.status(200).json(nested);
    }
  } 
  catch (err) {
    res.status(500).json({ message: "Failed to retrieve pictures" });
  }
});

// updates db with new Instagram data - doesn't delete
router.get("/update", async (req, resToClient) => {
  loggedInUsername = req.loggedInUsername;

  try {
    const user = await userHelper.findUserByUsername(loggedInUsername);
    const accesscode = user.access_token;
    // get new photos from instagram
    const picFromInst = await helper.instaExport(accesscode, user.id);
    // save new photos to DB

    // get all photos for user (which should include the new stuff now)
    // return all photos
  } 
  catch (err) {
    resToClient.status(500).json({ message: "Failed to retrieve pictures" });
  }
});

router.get("/import", async (req, resToClient) => {
  loggedInUsername = req.loggedInUsername;

  try {
    const user = await userHelper.findUserByUsername(loggedInUsername);
    const accesscode = user.access_token;
    // get new photos from instagram
    const picFromInst = await helper.instaExport(accesscode, user.id);
    // save new photos to DB
helper
    .postNewPictureInfo(picFromInst)
    .then(newPicture => {
      res.status(200).json({user, pictures: newPicture});
    })
    // get all photos for user (which should include the new stuff now)
    // return all photos
  } 
  catch (err) {
    resToClient.status(500).json({ message: "Failed to retrieve pictures" });
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
router.delete("/refresh/", async (req, resDelToClient) => {
  loggedInUsername = req.loggedInUsername;

  try {
    // search users table by Insta username (done)
    const user = await userHelper.findUserByUsername(loggedInUsername);
    // Wipes existing picture table for user
    const deleted = await helper.deletePicture(user.id);
    // get accesscode for user
    const accesscode = user.access_token;
    // api to Instagram endpoint w/access code
    const pictures = await helper.instaExport(accesscode, user.id);
    // send pictures in format front end wants
    res.status(200).json({ ...user, pictures: pictures });
  } 
  catch (err) {
    resDelToClient.status(500).json({ message: "Failed to retrieve pictures" });
  }
});

module.exports = router;
