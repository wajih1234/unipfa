const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   
    pass: process.env.EMAIL_PASS    
  }
});

const sendOTPEmail = async (toEmail, otp) => {
  await transporter.sendMail({
    from: `"UniPFA" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your Verification Code",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP code is:</p>
      <h1 style="letter-spacing: 8px; color: #4F46E5;">${otp}</h1>
      <p>This code expires in <strong>10 minutes</strong>.</p>
    `
  });
};

module.exports = sendOTPEmail;