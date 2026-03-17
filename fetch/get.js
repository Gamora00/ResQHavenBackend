const express = require('express');
const router = express.Router();

const {getAllCenters} = require('../get/fetchCenter')
const {hazard} = require('../get/hazard');
const { getMe } = require('../get/getMe')
const {listing} = require('../get/listing')
const {profile} = require('../get/profile')


const {protect} = require('../middleware/middleware')

router.get('/evacuations', getAllCenters)
router.get('/hazards', hazard)

console.log(getMe);

router.get('/me', protect, getMe)
router.get('/evac-list/:id', listing)

router.get('/profile/:id', profile)



module.exports = router;