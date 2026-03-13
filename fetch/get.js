const express = require('express');
const router = express.Router();

const {getAllCenters} = require('../get/fetchCenter')
const {hazard} = require('../get/hazard')

router.get('/evacuations', getAllCenters)
router.get('/hazards', hazard)



module.exports = router;