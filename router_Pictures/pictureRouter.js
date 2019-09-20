const express = require("express");
const router = express.Router();
const helper = require("./pictureHelper");

// server route = /map

// Get All Pictures of Logged In User
// Comment out before production
router.get("/", (req, res) => {
  loggedInId = req.loggedInId

  helper
    .getPictures(loggedInId)
    .then(pictures => {
      res.status(200).json(pictures);
    })
    .catch(error => {
      res.status(500).json({ Error: "Failed to retrieve pictures" });
    });
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
