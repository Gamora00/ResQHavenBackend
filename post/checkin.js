const db = require('../database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.checkin = async (req, res) => {

  const connection = await db.getConnection()

  try {

    await connection.beginTransaction()

    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const adminId = decoded.id

    console.log(adminId);
    
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
      province,
      people,
      allergies,
      medicines,
      special_foods
    } = req.body

    console.log("Body:", req.body)

    if (
      !firstname ||
      !lastname ||
      !phone ||
      !email ||
      !password ||
      !barangay ||
      !municipality ||
      !province
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    // Check existing email
    const [existing] = await connection.query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    )

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    // Insert user
    const [userResult] = await connection.query(
      `INSERT INTO users
      (firstName, lastName, phone, password,
       barangay, city, province,
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

    const userId = userResult.insertId

    // Get admin center
    const [admins] = await connection.query(
      `SELECT assigned_center_id
       FROM admins
       WHERE id = ?`,
      [adminId]
    )

    if (admins.length === 0) {
      throw new Error("Admin not found")
    }

    const centerId = admins[0].assigned_center_id

    // Insert check-in
    await connection.query(
      `INSERT INTO evacuee_checkins
      (center_id, user_id, registered_by)
      VALUES (?,?,?)`,
      [
        centerId,
        userId,
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
            userId,
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
            userId,
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
            userId,
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

    const peopleCount = people || 1

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
      userId,
      centerId
    })

  } catch (error) {

    await connection.rollback()

    console.log("Checkin error:", error)

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    })

  } finally {

    connection.release()

  }

}