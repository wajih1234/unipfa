const express=require('express');
const router=express.Router();
const authRoutes = require('./auth');
const addproject=require('./project1');


router.use('/auth', authRoutes);
router.use('/work',addproject);


module.exports=router;