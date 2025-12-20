const User = require('../models/User');
const mongoose = require('mongoose');
const Project = require('../models/Project');
exports.getAllteachers =async(req,res) =>{
    try{
        const users = await User.find({role :"teacher"}, 'name email mongoose.Schema.Types.ObjectId domain ');
        res.json(users);

 
     } catch(error){
        res.status(500).json({msg:'error in server'});
     }



};
exports.getproteach=async(req,res)=>{
try{
    const teacherObjectId = new mongoose.Types.ObjectId(req.user.id);
 const projects = await Project.find({ teacherId: teacherObjectId });
 res.json(projects);
}catch(error){
    console.error("Error in getproteach:", error);
   res.status(500).json({msg:'error', details: error.message});
}
};
