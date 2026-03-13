const db = require('../database')


exports.hazard = async (req, res)=>{
    try{
        const {barangay, municipality, province, latitude, longitude, disaster_type, level} = req.body

        const [result] = await db.query(`INSERT INTO flood_hazard_zones (barangay, city, province, latitude, longitude, flood_risk, disaster_type)  
            VALUES(?,?,?,?,?,?,?)
            `,[barangay,municipality,province,latitude,longitude,level,disaster_type])

        return res.status(200),json({
            success: true,
            message: "Successfully added"
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to insert"
            
        })
    }


}