const User = require('../models/User');


exports.getAllteachers =async(req,res) =>{
    try{
        const users = await User.find({role :"teacher"}, 'name email mongoose.Schema.Types.ObjectId domain ');
        res.json(users);

 
     } catch(error){
        res.status(500).json({msg:'error in server'});
     }



};
