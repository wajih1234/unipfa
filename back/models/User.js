const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,  
    lowercase: true, 
    trim: true      
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['student', 'teacher'],
    default: 'student', 
  
  },
  isVerified: {
  type: Boolean,
  default: false
},
otp: {
  type: String,
  default: null
},
otpExpires: {
  type: Date,
  default: null
},
  domain: {
    type: String,
    required: function () {
      return this.role === 'teacher';
    }
  },
  });
module.exports = mongoose.model('User', UserSchema);