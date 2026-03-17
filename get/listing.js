const db = require('../database')

exports.listing = async (req, res) => {
    try {

        const { id } = req.params
        console.log(id)

        const listQuery = `
        SELECT ec.id AS checkin_id, u.*
FROM evacuee_checkins ec
INNER JOIN users u 
    ON ec.user_id = u.id
WHERE ec.center_id = ? AND u.status = 'Evacuated'

        `

        const [response] = await db.query(listQuery, [id])

        console.log(response)

        return res.status(200).json({
            success: true,
            data: response
        })

    } catch (error) {
        console.log(error)

        return res.status(500).json({
            message: "Failed to fetch",
            success: false
        })
    }
}