// backend/get/getMe.js
const db = require('../database')

exports.profile = async (req, res) => {
  try {

    const {id} = req.params

    const [users] = await db.query(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    )

    if (users.length > 0) {
      return res.status(200).json({
        success: true,
        user: {
          ...users[0]
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