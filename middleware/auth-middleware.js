const jwt = require('jsonwebtoken')
const secret = require('../token/secret')


module.exports = (req, res, next) => {

  const token = req.headers.authorization

  
  if (token) {        
    
    jwt.verify(token, process.env.TOKENSECRET, (err, decodedToken) => {
        if(err) {
            console.log('WTF')
            res.status(401).json({ message: 'Invalid Token' })
        } else {
            req.loggedInId = decodedToken.subject
            next()
        }
      })        
    } else {
        res.status(401).json({ message: "YOU SHALL NOT PASS!"})
    }
};