const db = require('../database')

exports.hazard = async (req, res) => {
  
  try{


    const [centers] = await db.query(`SELECT * FROM flood_hazard_zones`)
    return res.status(200).json(centers)


  }catch(err){
      if(err){
              return res.status(500).json({
              success: false,
              message: 'Failed to fetch the hazard zones'
              })
            }
  }
  
}