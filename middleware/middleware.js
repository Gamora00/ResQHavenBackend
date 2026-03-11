const jwt = require('jsonwebtoken')


exports.protect = (req,res,next)=>{
    try{
        const token = req.cookies.token
        

        if(!token && req.role === 'user'){
            return res.status(401).json({
                success:false,
                message: 'Not authorized!'
            })
        }

        // if(!token && req.role === 'admin'){
        //     return res.status(401).json({
        //         success:false,
        //         message: 'Not authorized!'
        //     })
        // }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.user = decoded
        next()
    }catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalid or expired!'
    })
  }
}