const nodemailer = require("nodemailer");

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // TLS
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

module.exports = {transporter, generateOtp};
