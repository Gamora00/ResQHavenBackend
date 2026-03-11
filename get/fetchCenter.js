const db = require('../database')

exports.getAllCenters = async (req, res) => {
  
  try{


    const [centers] = await db.query(`SELECT * FROM evacuation_centers`)
    return res.status(200).json(centers)


  }catch(err){
      if(err){
              return res.status(500).json({
              success: false,
              message: 'Failed to fetch the evacuation centers'
              })
            }
  }
  
}