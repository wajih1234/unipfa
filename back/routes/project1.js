const express = require('express');
const router = express.Router();
const { Project ,updatepro, getprojects} = require('../controllers/Project');
const { getAllteachers,getproteach} = require('../controllers/teach');

const auth =require('../middlware/auth');
// student
router.get('/teachers',auth,getAllteachers);
router.post('/addproject',auth,Project);
router.get('/getprojects',auth,getprojects);
//teacher
router.get('/teachersget',auth,getproteach);
router.put('/decide',auth,updatepro);
module.exports = router;