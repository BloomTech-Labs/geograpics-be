const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.TOKENSECRET, (err, decodedToken) => {
      if (err) {
        console.log("Error from Token", err)
        res.status(401).json({ message: "Invalid Token" });
      } else {
        req.loggedInUsername = decodedToken.username;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "YOU SHALL NOT PASS!" });
  }
};
