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



        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match!" });
        }

        // Check if school already exists
        const existingSchool = await School.findOne({ email });
        if (existingSchool) {
            return res.status(400).json({ error: "School already registered!" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        const files = req.files;

        // Cloudinary URLs
        const logo = files['logo'] ? files['logo'][0].path : null;
        const signature = files['signature'] ? files['signature'][0].path : null;
        


       

        // Create a new school
        const newSchool = new School({
            schoolName,
            email,
            password: hashedPassword,
            address,
            contactNumber,
            logo, // Save the image path in the database
            signature,
            city,
            affnumber
        });

        delete req.session.tempSchoolData;


        await newSchool.save();
        req.flash("success_msg", "registered successfully! please login");
        res.redirect("/loginS");

    } catch (err) {
       
        res.status(500).json({ error: "Server Error" });
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
       
        req.flash("success_msg","welcome to dashboard");
        res.render("school/dashboard", {
            school,
            schoolId,
            totalTeachers,
            totalStudents,
            pendingRequests,
            teachers,
            students
        });
       
    } catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).send("Server Error");
    }};

    exports.delete_teacher = async (req, res) => {
        const { id } = req.params;
        const { schoolId } = req.query;
    
        try {
            await ClassTeacher.findByIdAndDelete(id);
            req.flash("error_msg", "Class Teacher deleted successfully!");
            res.redirect(`/schools/${schoolId}`);
        } catch (err) {
            console.error("Delete error:", err);
            res.status(500).send("Server Error");
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
            res.status(500).send("Error updating teacher");
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
              folder: "school_uploads",  // ✅ your custom folder
              resource_type: "image"
            });
            updateData.logo = logoUpload.secure_url; // Save URL to DB
          }
        
          // ✅ Upload signature if provided
          if (req.files.signature) {
            const signatureUpload = await cloudinary.uploader.upload(req.files.signature[0].path, {
              folder: "school_uploads",  // ✅ same folder
              resource_type: "image"
            });
            updateData.signature = signatureUpload.secure_url;
          }
      
          await School.findByIdAndUpdate(id, updateData);
      
          res.redirect(`/schools/${id}`); // Or wherever your dashboard is
        } catch (err) {
          console.error("Update error:", err);
          res.status(500).send("Something went wrong");
        }
      };
   

    exports.save_teacher= async (req, res) => {
        const schoolId = req.params.id;
        const { password, confirmPassword, fullName, className, section} = req.body;
    
        if (password !== confirmPassword) {
            return res.send("Passwords do not match");
        }
    
        try {
            // 🔐 Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // 🧠 Username base: from full name
            
        const base = fullName.trim().toLowerCase().split(" ")[0]; // First name
        let suffix = 1;
        let username;

        // 🧪 Loop until a unique username is found
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
            console.error("Error adding class teacher:", err);
            res.status(500).send("Server Error");
        }
    };


exports.forgot_pass=async (req, res) => {
    const { email, affiliationNumber } = req.body;
    const school = await School.findOne({ email: email,affnumber: affiliationNumber });
    console.log(school);
  
    if (!school) {
      return res.send('Invalid email or affiliation number');
    }
  
    const otp = generateOtp();

    req.session.forgotOtp = {
        email,
        otp,
        expires: Date.now() + 5 * 60 * 1000
      };
      
  
    // Send OTP via email (using nodemailer)
    
    try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: email,
          subject: "otp for reset the password",
          text: `Your OTP is: ${otp}, please enter it to verify`
        });
        res.render('school/verify-otp', { email });
          } catch (error) {
        console.log(error);
        res.send("Failed to send OTP.");
      }
  };
 

exports.verify_otp=(req, res) => {
    const { email, otp, expires } = req.session.forgotOtp || {};
    const enteredOtp= req.body.otp;

if (!email || !otp || Date.now() > expires) {
  return res.send('OTP expired or invalid session');
}

if (enteredOtp !== otp) {
  return res.send('Invalid OTP');
}
    
  
    res.render('school/set-new-password', { email });
  };

  exports.set_new_password= async (req, res) => {
    const { email, password } = req.body;
  
    const school = await School.findOne({ email });
    if (!school) return res.send('School not found');
  
    school.password = await bcrypt.hash(password, 10); // You should hash it if using bcrypt
    await school.save();

    delete req.session.forgotOtp;

  
    res.redirect("/loginS");
  };
  
    

//  Logout School
exports.logoutSchool =  (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Logout error:", err);
            return res.send("Error logging out");
        }
      
        res.clearCookie("connect.sid");
      
        res.redirect("/loginS");
    });
};
