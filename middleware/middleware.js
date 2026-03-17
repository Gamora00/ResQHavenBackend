// backend/middleware/middleware.js
const jwt = require('jsonwebtoken')

// ✅ Check if logged in
exports.protect = (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token && req.headers.authorization) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized!'
      })
    }

    const decoded = jwt.verify(
      token, process.env.JWT_SECRET
    )
    req.user = decoded
    next()

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalid or expired!'
    })
  }
}

// ✅ Super admin only
exports.superAdminOnly = (req, res, next) => {
  if (req.user?.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Super Admin access only!'
    })
  }
  next()
}

// ✅ Any admin role
exports.adminOnly = (req, res, next) => {
  const adminRoles = [
    'super_admin',
    'center_staff',
    'barangay_official'
  ]
  if (!adminRoles.includes(req.user?.role)) {
    return res.status(403).json({
      success: false,
      message: 'Admin access only!'
    })
  }
  next()
}

// ✅ Center staff only
exports.dswd = (req, res, next) => {
  const allowed = [
    'super_admin',
    'dswd'
  ]
  if (!allowed.includes(req.user?.role)) {
    return res.status(403).json({
      success: false,
      message: 'Center Staff access only!'
    })
  }
  next()
}

// ✅ User only
exports.userOnly = (req, res, next) => {
  if (req.user?.role !== 'user') {
    return res.status(403).json({
      success: false,
      message: 'User access only!'
    })
  }
  next()
}