const db = require('../database')

exports.evacuation = async (req, res) => {
  try {

    const {
      name,
      address,
      barangay,
      municipality,
      province,
      latitude,
      longitude,
      capacity,
      disaster_type
    } = req.body

    // Validate required fields
    if (
      !name ||
      !address ||
      !barangay ||
      !municipality ||
      !province ||
      !latitude ||
      !longitude ||
      !capacity
    ) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled!'
      })
    }

    // Save to database
   const [result] = await db.query(
      `INSERT INTO evacuation_centers 
        (name, address, barangay, 
         city, province, 
         latitude, longitude, 
         capacity, disaster_type) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        address,
        barangay,
        municipality,
        province,
        latitude,
        longitude,
        capacity,
        disaster_type || null
      ]
    )

    return res.status(201).json({
      success: true,
      message: 'Evacuation center saved successfully!',
      data: {
        name,
        address,
        barangay,
        municipality,
        province,
        latitude,
        longitude,
        capacity,
        disaster_type
      }
    })

  } catch (error) {
    console.error('Evacuation center error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      error: error.message
    })
  }
}
