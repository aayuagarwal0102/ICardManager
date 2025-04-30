const nodemailer = require("nodemailer");

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  };

const sendOTP = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
  });
};

module.exports = sendOTP;
