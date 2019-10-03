const express = require("express");
const router = express.Router();
const helper = require("./userHelper");

// server route = /users

// Retrieve list of all users
// Security risk - Comment out before production---
// router.get("/", (req, res) => {
//   helper
//     .findAllUsers()
//     .then(users => {
//       res.status(200).json(users);
//     })
//     .catch(error => {
//       res.status(500).json({ Error: "Failed to retrieve users" });
//     });
// });

// Insert new user into DB
// sends new user ID back
// Commented out - security risk since it bypasses Passport authentication

// router.post("/", (req, res) => {
//   let newUserInfo = req.body;
//   helper
//     .postNewUser(newUserInfo)
//     .then(newUser => {
//       res.status(200).json(newUser);
//     })
//     .catch(error => {
//       res.status(500).json({ Error: "Failed to add new user" });
//     });
// });

router.put("/:id", (req, res) => {
  let id = req.params.id;
  let editInfo = req.body;
  helper
    .editUser(id, editInfo)
    .then(edited => {
      res.status(200).json(edited);
    })
    .catch(error => {
      res.status(500).json({ Error: "Failed to edit user" });
    });
});

// Delete user - id must be in URL parameter string

// Commented out - not currently used
// router.delete("/:id", (req, res) => {
//   let id = req.params.id;
//   helper
//     .deleteUser(id)
//     .then(deleted => {
//       res.status(201).json(deleted);
//     })
//     .catch(error => {
//       res.status(500).json({ Error: "Failed to delete user" });
//     });
// });

module.exports = router;
