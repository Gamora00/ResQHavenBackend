const db = require('../database')
const bcrypt = require('bcrypt')

exports.admins = async (req, res) => {
  try {

    const {
      firstname,
      lastname,
      email,
      password,
      role,
      assignedCenter
    } = req.body

 
    if (
      !firstname || !lastname ||
      !email || !password || !role
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required!'
      })
    }

    const validRoles = [
      'dswd',
      'drrmo',
      'barangay_official'
    ]

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role! Must be dswd, drrmo, or barangay_official'
      })
    }

    const [existing] = await db.query(
      `SELECT id FROM admins 
       WHERE email = ?`,
      [email]
    )

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered!'
      })
    }

    const hashPassword =
      await bcrypt.hash(password, 10)

  
    const [result] = await db.query(
      `INSERT INTO admins 
        (firstName, lastName, email, password, role, assigned_center_id) 
       VALUES (?,?,?,?,?, ?)`,
      [
        firstname,
        lastname,
        email,
        hashPassword,
        role,
        assignedCenter || 0
      ]
    )


    return res.status(201).json({
      success: true,
      message: 'Admin registered successfully!',
    })

  } catch (error) {
    console.log('Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      error: error.message
    })
  }
}
