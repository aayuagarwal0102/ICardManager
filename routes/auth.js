const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const School = require("../models/School");
const ClassTeacher = require("../models/ClassTeacher");
const router = express.Router();
const {transporter, generateOtp}= require("../utils/sendOtp");
const nodemailer= require("nodemailer");


const SECRET_KEY = "your_secret_key"; // ✅ Make sure to use env variable in production

// POST: Login for School and Class Teacher
// 🔐 POST: Login for School and Class Teacher
router.post("/login",async (req, res) => {
    try {
        const { identifier, password } = req.body;

        let user, role, redPath;

        if (identifier.includes("@")) {
            user = await School.findOne({ email: identifier });
         
            role = "school";
            redPath=`/schools/${user._id}`;
        } else {
            user = await ClassTeacher.findOne({ username: identifier });
         
            role = "classTeacher";
            redPath=`/class-teacher/${user._id}`;
        }
        


        

        if (!user) {
            req.flash("error_msg", "Invalid credentials!");
            return res.redirect("/loginS");
        }
        

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash("error_msg", "Invalid credentials!");
            return res.redirect("/loginS");
        }

        console.log("Session Created:", req.session.role);
        
        // ✅ SESSION SET
        req.session.userId = user._id;
        req.session.role = role;
        console.log("Session Created:", req.session);
     

        res.json({ success: true, redirect: redPath});

        

       

    } catch (err) {
        console.error("Login Error:", err);
        req.flash("error_msg", "Server error!");
        res.redirect("/loginS");
    }
});

router.post("/verify-otp", (req, res) => {
    const userOtp = req.body.otp.join("");
    if (userOtp === req.session.otp) {
      const schoolData = req.session.tempSchoolData;
      console.log(schoolData);
      req.session.otp = null;
      // req.flash("success_msg","otp verified");
      res.render('school/register.ejs',  { showOtpStep: false, showFinalStep: true });
    } else {
      // req.flash("error_msg","wrong otp, please see again");
      res.render('school/register.ejs',  { showOtpStep: true, showFinalStep: false, error: "Incorrect OTP" });
    }
  });

   router.post("/send-otp", async (req, res) => {
         
          const otp = generateOtp();
          req.session.otp = otp;
  
          const { schoolName, contactNumber, email } = req.body;
  
    // Store in session
    req.session.tempSchoolData = { schoolName, contactNumber, email };
  
          
        
          try {
            await transporter.sendMail({
              from: process.env.EMAIL,
              to: email,
              subject: "Your OTP Code for register your school",
              text: `Your OTP is: ${otp}, please enter it to verify`
            });
            res.render('school/register.ejs', { showOtpStep: true, showFinalStep: false });
          } catch (error) {
            console.log(error);
            res.send("Failed to send OTP.");
          }
  
        });

        router.get('/resend-otp', async (req, res) => {
                const { schoolName, contactNumber, email } = req.body;
            
                if (!email || !contactNumber || !schoolName) {
                    return res.redirect('/registerS'); // if session expired
                }
            
                const otp=generateOtp();
                req.session.otp = otp;
                req.session.otpExpiresAt = Date.now() + 2 * 60 * 1000;
            
                // use nodemailer or your sendOtp function
                try {
                  await transporter.sendMail({
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Your OTP Code for register your school",
                    text: `Your OTP is: ${otp}, please enter it to verify`
                  });
                  res.render('school/register.ejs', { showOtpStep: true, showFinalStep: false  });
                } catch (error) {
                  console.log(error);
                  res.send("Failed to send OTP.");
                }
            
             
            });

module.exports = router;
