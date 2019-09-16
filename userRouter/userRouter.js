const express = require("express");
const router = express.Router();
const helper = require("./userHelper");

// Retrieve list of all users
// Comment out before production
router.get("/", (req, res) => {
  helper
    .findAllUsers()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({ Error: "Error" });
    });
});

// Insert new user into DB
router.post("/", (req, res) => {
  let newUserInfo = req.body;
  helper
    .postNewUser(newUserInfo)
    .then(newUser => {
      res.status(200).json(newUser);
    })
    .catch(error => {
      res.status(500).json({ Error: "Error" });
    });
});

// Edit user info - ALL user info, must fill in all fields
// regardless if they change or not
router.put("/:id", (req, res) => {
  let id = req.params.id;
  let editInfo = req.body;
  helper.editUser(id, editInfo).then(edited => {
    res.status(200).json(edited);
  });
});

// Delete user
router.delete("/:id", (req, res) => {
  let id = req.params.id;
  helper.deleteUser(id).then(deleted => {
    res.status(200).json(deleted);
  });
});

module.exports = router;
