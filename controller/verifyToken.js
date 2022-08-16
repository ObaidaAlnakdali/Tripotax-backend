const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  //check if token exsist
  const token = req.header('auth-token')
  if(!token) return res.status(401).send({ message: 'Access denied, you should be logged in' })

  //if check true we enable verify to play with database
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET)  
    req.user = verified
    next()
  } 
  catch (error) {
    res.status(400).send('Invalid token')
  }
}

module.exports = auth