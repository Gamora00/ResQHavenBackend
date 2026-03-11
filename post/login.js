const db = require('../database')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


exports.login = async (req,res)=>{

    try{

    const {email, password} = req.body


         const [users] = await db.query(
        `SELECT * FROM users 
        WHERE email = ?`,
        [email]
    )


    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Email not found!'
      })
    }


    const user = users[0]
    const match = await bcrypt.compare(
      password, user.password
    )

    if (!match) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password!'
      })
    }


    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: 'user'
      },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '24h' }
    )

    res.cookie('token', token, {
      httpOnly: true,  // JS cannot access
      secure: false,   // true in production (HTTPS)
      sameSite: 'lax', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })


    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        name: user.firstName,
        email: user.email
      }
    })

    }catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error.',
      error: error.message
    })
  }






    
    
}