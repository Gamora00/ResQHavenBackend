const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  try {

    let token = req.cookies.token

    // fallback to Authorization header
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1]
    }

    console.log("Token:", token)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    req.user = decoded
    next()

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }
}

module.exports = protect