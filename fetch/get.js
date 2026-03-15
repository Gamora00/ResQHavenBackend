const express = require('express');
const router = express.Router();

const {getAllCenters} = require('../get/fetchCenter')
const {hazard} = require('../get/hazard');
const { getMe } = require('../get/getMe')


const protect = require('../middleware/middleware')

router.get('/evacuations', getAllCenters)
router.get('/hazards', hazard)

console.log(getMe);

router.get('/me', protect, getMe)

module.exports = router;