const express = require('express');
const router = express.Router();
const multer = require('multer');

const {evacuation} = require('../post/evacuationCenter')
const {users} = require('../post/user')
const {login} = require('../post/login')
const {hazard} = require('../post/hazard')


router.post('/evacuation-reg', evacuation)
router.post('/user-reg', users)
router.post('/login', login)

router.post('/hazard-reg', hazard)





module.exports = router;