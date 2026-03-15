const db = require('../database')
const jwt = require('jsonwebtoken')

exports.qrCheckin = async (req,res)=>{

  const connection = await db.getConnection()

    try{

        const token = req.cookies.token
        
            if (!token) {
              return res.status(401).json({
                success: false,
                message: "Unauthorized"
              })
            }
        
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const adminId = decoded.id


        const {user_id, allergies, medicines, special_foods} = req.body



      // Get admin center
    const [admins] = await connection.query(
      `SELECT assigned_center_id
       FROM admins
       WHERE id = ?`,
      [adminId]
    )

    const centerId = admins[0].assigned_center_id

    if (admins.length === 0) {
      throw new Error("Admin not found")
    }

    
  
      await connection.query(
      `INSERT INTO evacuee_checkins
      (center_id, user_id, registered_by)
      VALUES (?,?,?)`,
      [
        centerId,
        user_id,
        adminId
      ]
    )
    
    // Insert allergies
    if (allergies && allergies.length > 0) {

      for (const allergy of allergies) {

        await connection.query(
          `INSERT INTO special_needs
          (center_id, user_id, type, name)
          VALUES (?,?,?,?)`,
          [
            centerId,
            user_id,
            'allergy',
            allergy.name
          ]
        )

      }

    }

    // Insert medicines
    let medicineQty = 0

    if (medicines && medicines.length > 0) {

      for (const med of medicines) {

        medicineQty += Number(med.quantity)

        await connection.query(
          `INSERT INTO special_needs
          (center_id, user_id, type, name, quantity)
          VALUES (?,?,?,?,?)`,
          [
            centerId,
            user_id,
            'medicine',
            med.name,
            med.quantity
          ]
        )

      }

    }

    // Insert special foods
    let foodQty = 0

    if (special_foods && special_foods.length > 0) {

      for (const food of special_foods) {

        foodQty += Number(food.quantity)

        await connection.query(
          `INSERT INTO special_needs
          (center_id, user_id, type, name, quantity)
          VALUES (?,?,?,?,?)`,
          [
            centerId,
            user_id,
            'special_food',
            food.name,
            food.quantity
          ]
        )

      }

    }

    // Update evacuee needs
    const [needsExist] = await connection.query(
      `SELECT id FROM evacuee_needs
       WHERE center_id = ?`,
      [centerId]
    )

    const peopleCount = 1

    if (needsExist.length > 0) {

      await connection.query(
        `UPDATE evacuee_needs
        SET
          food_count = food_count + ?,
          water_count = water_count + ?,
          special_needs_count = special_needs_count + ?,
          medical_count = medical_count + ?
        WHERE center_id = ?`,
        [
          peopleCount,
          peopleCount,
          foodQty,
          medicineQty,
          centerId
        ]
      )

    } else {

      await connection.query(
        `INSERT INTO evacuee_needs
        (center_id, food_count, water_count, special_needs_count, medical_count)
        VALUES (?,?,?,?,?)`,
        [
          centerId,
          peopleCount,
          peopleCount,
          foodQty,
          medicineQty
        ]
      )

    }

    // Update center occupancy
    await connection.query(
      `UPDATE evacuation_centers
      SET current_occupancy = current_occupancy + ?
      WHERE id = ?`,
      [
        peopleCount,
        centerId
      ]
    )

    await connection.commit()

    return res.status(201).json({
      success: true,
      message: "Check-in successful",
      user_id,
      centerId
    })

    }catch(error){
        await connection.rollback()

    console.log("Checkin error:", error)

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    })
    }finally{
      connection.release()
    }
}
