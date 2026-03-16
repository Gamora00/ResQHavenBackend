// backend/get/getMe.js
const db = require('../database')

exports.getMe = async (req, res) => {
  try {

    const [users] = await db.query(
      `SELECT * FROM users WHERE id = ?`,
      [req.user.id]
    )

    if (users.length > 0) {
      return res.status(200).json({
        success: true,
        user: {
          ...users[0],
          role: 'user'
        }
      })
    }

    const [admins] = await db.query(
      `SELECT * FROM admins WHERE id = ?`,
      [req.user.id]
    )

    if (admins.length > 0) {
      console.log(admins);
      
      return res.status(200).json({
        success: true,
        user: {
          ...admins[0],
          role: admins[0].role
        }
      })
    }

    return res.status(404).json({
      success: false,
      message: 'User not found'
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}