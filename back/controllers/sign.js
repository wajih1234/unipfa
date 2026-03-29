const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const sendOTPEmail = require('../utils/sendEmail');

exports.signup = async (req, res) => {
  const { name, email, password, role, domain } = req.body;
  try {
    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ msg: 'Invalid email format' });
    }
    if (password.length < 7) {
      return res.status(400).json({ msg: 'Password must be at least 7 characters' });
    }
    if (!['student', 'teacher'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Build user data
    const userData = {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      otp,
      otpExpires,
      isVerified: false
    };

    if (role === 'teacher') {
      userData.domain = domain;
    }

    user = new User(userData);
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(201).json({ msg: 'OTP sent to your email. Please verify.' });

  } catch (err) {
    res.status(500).send('Server error');
  }
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (user.isVerified) return res.status(400).json({ msg: 'Already verified' });
    if (user.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });
    if (user.otpExpires < new Date()) return res.status(400).json({ msg: 'OTP expired' });

    // Activate account
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ msg: 'Email verified! You can now log in.' });

  } catch (err) {
    res.status(500).send('Server error');
  }
};
