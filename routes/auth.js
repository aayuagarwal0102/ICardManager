const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const School = require("../models/School");
const ClassTeacher = require("../models/ClassTeacher");
const router = express.Router();

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


  





module.exports = router;
