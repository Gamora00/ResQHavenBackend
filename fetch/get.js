const express = require('express');
const router = express.Router();

const {getAllCenters} = require('../get/fetchCenter')

router.get('/evacuations', getAllCenters)


module.exports = router;