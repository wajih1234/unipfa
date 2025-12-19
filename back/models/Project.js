const mongoose = require('mongoose');
const ProjectSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true},
  title: { type: String, required: true , unique: true,}, 
  description:{type:String,required:true},
   teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    domain: {
      type: String,
      required: true
    },
  status: { type: String, 
    enum: ['pending', 'accepted','refused'],
    default: 'pending', 
  
} ,
},{ timestamps: true }
);
module.exports = mongoose.model('Project', ProjectSchema);