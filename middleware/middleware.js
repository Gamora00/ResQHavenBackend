// backend/middleware/middleware.js
const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  try {
    const token = req.cookies.token


    console.log("Token" + token);
    
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

// ✅ Default export!
module.exports = protect