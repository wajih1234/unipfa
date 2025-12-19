const express = require('express');
const router = express.Router();
const { Project ,updatepro, getprojects} = require('../controllers/Project');
const { getAllteachers} = require('../controllers/teach');

const auth =require('../middlware/auth');

router.get('/teachers',auth,getAllteachers);
router.post('/addproject',auth,Project);
router.put('/decide',auth,updatepro);
router.get('/getprojects',auth,getprojects);

module.exports = router;