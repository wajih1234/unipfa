const bcrypt = require('bcryptjs');

const User = require('../models/User');

exports.signup = async (req, res) => {
  const { name, email, password,role ,domain } = req.body;
  try {
    if (!name || !email || !password || !role) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ msg: 'Invalid email format' });
  }
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    if(password.length <7)  return res.status(400).json({ msg: 'password  must be at least 7 characters ' });
    if (!['student', 'teacher'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

   const userData = {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role
    };
     
     if (role === 'teacher') {
      userData.domain = domain;
      
    }

    user = new User(userData);
    await user.save();
    
    res.status(201).json({ msg: 'User registered successfully' });
    
  } catch (err) {
    res.status(500).send('Server error');
  }
};
