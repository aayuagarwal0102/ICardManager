const express = require('express');
const router = express.Router();
const School = require('../models/School'); // Import School Model
const Student = require('../models/Student');
const ClassTeacher= require("../models/ClassTeacher");
const adminController = require('../controllers/adminController');
const { getSchoolDetails, getSchools } = require('../controllers/adminController');

const { printStudentId } = require('../controllers/adminController');
const { isAdminLoggedIn } = require('../middleware'); // Import middleware



router.post('/login', adminController.loginAdmin);

//  Dashboard (Only if admin logged in)
router.get('/login', adminController.showLoginPage);

router.get("/dashboard",adminController.dashboard);

//  Manage Schools (Only if admin logged in)
router.get('/manage-schools', isAdminLoggedIn, adminController.manageSchools);

router.post('/manage-schools/delete/:id', isAdminLoggedIn, adminController.deleteSchool);

router.get('/logout', isAdminLoggedIn, adminController.logoutAdmin);



// router.get('/print-id/:studentId', isAdminLoggedIn, printStudentId);

router.post('/print-id', isAdminLoggedIn, printStudentId);


  // Admin - Show Students Selection Page
  router.get('/select-students', async (req, res) => {
    try {
        const students = await Student.find(); // सिर्फ जिनका ID card generate नहीं हुआ है
       
        res.render('admin/selectStudents', { students });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// API route to fetch classes for a specific school
router.get('/schools/:id/classes', async (req, res) => {
  const schoolId = req.params.id;
  
  // Yahan database se classes fetch kar lo
  const classes = await ClassTeacher.find({ schoolId });

  res.render('admin/classes', { layout: "layouts/boilerplate", classes, schoolId });
  });

  
  router.get('/schools' ,isAdminLoggedIn, getSchools);
  

//  Individual School Page Route
router.get('/:id',isAdminLoggedIn, getSchoolDetails);

router.post('/select-template', (req, res) => {
    const { selectedTemplate } = req.body;
    req.session.selectedTemplate = selectedTemplate; // store template in session
   
    res.redirect('/admin/dashboard'); // or wherever you want
  });

  router.get('/schools/:schoolId/classes/:classId/students', async (req, res) => {
    const { schoolId, classId } = req.params;
  
    // Fetch students of that class
    const students = await Student.find({ classTeacherId: classId });
  
    res.render('admin/students',{ students, schoolId, classId });
  });
  



  



module.exports = router;
