const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function generateToken(user) {
  const payload = {
    subject: user.insta_id,
    username: user.username
  };

  const options = {
    expiresIn: "7d"
  };

  return jwt.sign(payload, process.env.TOKENSECRET, options);
};
