const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/sign');
const { login} = require('../controllers/Login');

router.post('/sign', signup);
router.post('/login', login);



module.exports = router;