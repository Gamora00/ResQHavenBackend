const db = require('../database')
const bcrypt = require('bcrypt')

exports.users = async (req, res) => {
  try {

    const {
      firstname,
      lastname,
      sex,
      birthday,
      phone,
      email,
      password,
      barangay,
      municipality, 
      province
    } = req.body

    if (
      !firstname || !lastname ||
      !phone || !email ||
      !password || !barangay ||
      !municipality || !province
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required!'
      })
    }

    const [existing] = await db.query(
      `SELECT id FROM users WHERE email = ?`,
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
      `INSERT INTO users 
        (firstName, lastName, phone, 
         password, barangay, 
         city, province, 
         email, birthday, sex) 
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        firstname,
        lastname,
        phone,
        hashPassword,
        barangay,
        municipality,
        province,
        email,
        birthday,
        sex
      ]
    )

    return res.status(201).json({
      success: true,
      message: 'Registered Successfully!'
    })

  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      error: error.message
    })
  }
}
