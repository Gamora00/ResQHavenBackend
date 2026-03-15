const express = require('express');
const router = express.Router();
const multer = require('multer');

const {evacuation} = require('../post/evacuationCenter')
const {users} = require('../post/user')
const {login} = require('../post/login')
const {hazard} = require('../post/hazard')
const {admins} = require('../post/admin')
const {checkin} = require('../post/checkin')
const {qrCheckin} = require('../post/qrCheckin')

router.post('/evacuation-reg', evacuation)
router.post('/user-reg', users)
router.post('/login', login)

router.post('/hazard-reg', hazard)
router.post('/admin-reg', admins)

router.post('/checkin', checkin)

router.post('/qr-checkin', qrCheckin)









module.exports = router;