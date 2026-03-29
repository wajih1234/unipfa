const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/sign');
const { login} = require('../controllers/Login');
const { verifyOtp } = require('../controllers/sign');
router.post('/sign', signup);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);


module.exports = router;