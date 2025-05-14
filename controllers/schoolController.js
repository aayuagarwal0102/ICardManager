const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const School = require('../models/School.js');
const ClassTeacher = require('../models/ClassTeacher.js');
const Student = require('../models/Student.js');
const session = require('express-session');
const flash = require('connect-flash');
const {cloudinary}= require("../config/multer.js");
const {transporter, generateOtp}= require("../utils/sendOtp");
const nodemailer= require("nodemailer");

require('dotenv').config();



const SECRET_KEY = "aayu";



exports.registerSchool = async (req, res) => {
    try {
        const {password, confirmPassword, address, city, affnumber } = req.body;

        const { schoolName, contactNumber, email } = req.session.tempSchoolData;



        if (password !== confirmPassword) {
          req.flash("error_msg","Passwords do not match!");
          return  res.render('school/register.ejs',  { showOtpStep: false, showFinalStep: true , error_msg: req.flash("error_msg")});
        }

        const existingSchool = await School.findOne({ email });
        if (existingSchool) {
            req.flash("error_msg","school already registerd");
           return  res.render('school/register.ejs',  { showOtpStep: false, showFinalStep: false , error_msg: req.flash("error_msg")});    
              }

        const hashedPassword = await bcrypt.hash(password, 10);


        const files = req.files;

        // Cloudinary URLs
        const logo = files['logo'] ? files['logo'][0].path : null;
        const signature = files['signature'] ? files['signature'][0].path : null;
    
        const newSchool = new School({
            schoolName,
            email,
            password: hashedPassword,
            address,
            contactNumber,
            logo, 
            signature,
            city,
            affnumber
        });

        delete req.session.tempSchoolData;


        await newSchool.save();
        req.flash("success_msg", "registered successfully! please login");
        res.redirect("/loginS");

    } catch (err) {
       req.flash("error_msg","server error");
        res.render('school/register.ejs',  { showOtpStep: false, showFinalStep: false , error_msg: req.flash("error_msg")});    

    }
}




exports.dashboard = async (req, res) => {
    const schoolId = req.params.id;

    try {
        const totalTeachers = await ClassTeacher.countDocuments({ schoolId });
        const totalStudents = await Student.countDocuments({ schoolId });
        const pendingRequests = await Student.countDocuments({ schoolId, idCardStatus: "Pending" });

        const teachers = await ClassTeacher.find({ schoolId });
        const students= await  Student.find({schoolId: schoolId});
        const school= await School.findById(schoolId);

        if (!school){
           req.flash("error_msg", "School not found.");
           return res.redirect("/loginS");
        }


       
        res.render("school/dashboard", {
            school,
            schoolId,
            totalTeachers,
            totalStudents,
            pendingRequests,
            teachers,
            students, 
        });
       
    } catch (err) {
        req.flash("error_msg", "server error.");
        res.redirect("/loginS");
    }};

    exports.delete_teacher = async (req, res) => {
        const { id } = req.params;
        const { schoolId } = req.query;
    
        try {
            await ClassTeacher.findByIdAndDelete(id);

            req.flash("error_msg", "Class Teacher deleted successfully!");
            res.redirect(`/schools/${schoolId}`);
        } catch (err) {
             req.flash("error_msg", "server error to delete teacher.");
             res.redirect(`/schools/${schoolId}`);
        }
    };

    

    exports.update_teacher= async (req, res) => {
        try {
            const { fullName, class: className, password, username, section } = req.body;
            const updateFields = { fullName, class: className, username, section };
    
            if (password) {
                const hashed = await bcrypt.hash(password, 10);
                updateFields.password = hashed;
            }
    
            await ClassTeacher.findByIdAndUpdate(req.params.teacherId, updateFields);
            req.flash("success_msg", "Class Teacher updated successfully!");
            res.redirect(`/schools/${req.params.schoolId}`);
        } catch (err) {
            req.flash("error_msg", "server error");
            res.redirect(`/schools/${req.params.schoolId}`);
        }
    }


    exports.update_profile = async (req, res) => {
        const { id } = req.params;
        const { schoolName, email, address, contactNumber, city, affnumber } = req.body;
      
        try {
          const updateData = {
            schoolName,
            email,
            address,
            contactNumber,
            city,
            affnumber
          };
      
          if (req.files.logo) {
            const logoUpload = await cloudinary.uploader.upload(req.files.logo[0].path, {
              folder: "school_uploads",  
              resource_type: "image"
            });
            updateData.logo = logoUpload.secure_url; 
          }
        
          if (req.files.signature) {
            const signatureUpload = await cloudinary.uploader.upload(req.files.signature[0].path, {
              folder: "school_uploads",  
              resource_type: "image"
            });
            updateData.signature = signatureUpload.secure_url;
          }
      
          await School.findByIdAndUpdate(id, updateData);
      
          res.redirect(`/schools/${id}`); 
        } catch (err) {
          req.flash("error_msg", "server error!");
            res.redirect(`/schools/${req.params.schoolId}`);
        }
      };
   

    exports.save_teacher= async (req, res) => {
        const schoolId = req.params.id;
        const { password, confirmPassword, fullName, className, section} = req.body;
    
        if (password !== confirmPassword) {
             req.flash("error_msg","Passwords do not match!");
           return res.redirect(`/schools/${schoolId}`);
        }
    
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            
        const base = fullName.trim().toLowerCase().split(" ")[0]; // First name
        let suffix = 1;
        let username;

        while (true) {
            username = `${base}${String(suffix).padStart(3, '0')}`;
            const existing = await ClassTeacher.findOne({ username });
            if (!existing) break;
            suffix++;
        }
          
    
            const newTeacher = new ClassTeacher({
                schoolId,
                username,
                password: hashedPassword,
                fullName,
                class: className,
                section
            });
    
            await newTeacher.save();
            req.flash("success_msg", `Class Teacher added successfully. Username: ${username}`);
            res.redirect(`/schools/${schoolId}`);
        } catch (err) {
            req.flash("error_msg", "server error!");
            res.redirect(`/schools/${schoolId}`);
        }
    };


exports.forgot_pass=async (req, res) => {
    const { email, affiliationNumber } = req.body;
    const school = await School.findOne({ email: email,affnumber: affiliationNumber });
  
    if (!school) {
           req.flash("error_msg", "school not found!");
          return  res.redirect(`/registerS`);
    }
  
    const otp = generateOtp();

    req.session.forgotOtp = {
        email,
        otp,
        expires: Date.now() + 5 * 60 * 1000
      };
          
    try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: email,
          subject: "otp for reset the password",
          text: `Your OTP is: ${otp}, please enter it to verify`
        });
        res.render('school/verify-otp', { email });
          } catch (error) {
        req.flash("error_msg","Failed to send OTP.");
           res.render('school/forgot-password', {error_msg: req.flash("error_msg") });
      }
  };

  exports.get_forgot= (req,res)=>{

    res.render("school/forgot-password.ejs");
  }
 

exports.verify_otp=(req, res) => {
    const { email, otp, expires } = req.session.forgotOtp || {};
    const enteredOtp= req.body.otp;

if (!email || !otp || Date.now() > expires) {
       req.flash("error_msg","OTP expired or invalid session");
      return res.redirect("/loginS");
}

if (enteredOtp !== otp) {
  req.flash("error_msg","OTP does not match");

  return  res.render("school/verify-otp", {email, error_msg: req.flash("error_msg")});
}
    
  
    res.render('school/set-new-password', { email });
  };

  exports.set_new_password= async (req, res) => {
    const { email, pass } = req.body;
    
      const school = await School.findOne({ email });

    if (!school || school==null){
           req.flash("error_msg", "school not found!");
          return  res.redirect(`/registerS`);
    } 
  
  
   const hash = await bcrypt.hash(pass, 10);
await School.findByIdAndUpdate(school._id, { password: hash });

    delete req.session.forgotOtp;

    req.flash("success_msg","password successfully changed");
    res.redirect("/loginS");
  };
  
    

//  Logout School
exports.logoutSchool =  (req, res) => {
    req.session.destroy((err) => {
      
        res.clearCookie("connect.sid");
      
        res.redirect("/loginS");
    });
};
