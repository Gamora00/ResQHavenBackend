const db = require('../database')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body


    console.log('Email received:', email)
    console.log('Password received:', password)
    const [users] = await db.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    )

    const [admins] = await db.query(
      `SELECT * FROM admins WHERE email = ?`,
      [email]
    )

    const isAdmin = admins.length > 0
    const account = users[0] || admins[0]
    console.log(account);
    

    // ✅ Fixed condition
    if (!account) {
      return res.status(400).json({
        success: false,
        message: 'Email not found!'
      })
    }

    // ✅ Compare password
    const match = await bcrypt.compare(
      password,
      account.password
    )

    if (!match) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password!'
      })
    }
    

    // ✅ Use account not user!
    const token = jwt.sign(
      {
        id: account.id,
        email: account.email,
        role: isAdmin ? account.role : 'user'
        
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    

    // ✅ Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000
    })

    // ✅ Return correct data
    return res.status(200).json({
  success: true,
  token, // add this
  message: 'Login successful!',
  user: {
    id: account.id,
    firstName: isAdmin
      ? account.name
      : account.firstName,
    email: account.email,
    role: isAdmin ? account.role : 'user'
  }
})

  } catch (error) {
    console.log(error) // ← add this to see error!
    return res.status(500).json({
      success: false,
      message: 'Server error.',
      error: error.message
    })
  }
}
