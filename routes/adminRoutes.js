const express = require('express');
const router = express.Router();
const School = require('../models/School'); // Import School Model
const Student = require('../models/Student');
const ClassTeacher= require("../models/ClassTeacher");
const  {loginAdmin, showLoginPage, dashboard, logoutAdmin, getSchools , select_students, get_classes, select_template, save_template, printStudentId, saveIdCardDesign, loadIdCardDesign, getSchoolDesigns, deleteDesign} = require('../controllers/adminController');
const { isAdminLoggedIn } = require('../middleware'); // Import middleware



router.post('/login',loginAdmin);

//  Dashboard (Only if admin logged in)
router.get('/login',showLoginPage);

router.get("/dashboard",isAdminLoggedIn,dashboard);



router.get('/logout', isAdminLoggedIn,logoutAdmin);


// API route to fetch classes for a specific school
router.get('/schools/:id/classes',isAdminLoggedIn ,get_classes );

  
  router.get('/schools' ,isAdminLoggedIn, getSchools);

  router.get('/select-template',isAdminLoggedIn,select_template);
  
  router.post('/print-id',isAdminLoggedIn, printStudentId);



router.post('/select-template',isAdminLoggedIn,save_template);

router.get('/schools/:schoolId/classes/:classId/students',isAdminLoggedIn,select_students);

// ID Card Design Management Routes
router.post('/save-design', isAdminLoggedIn, saveIdCardDesign);
router.get('/load-design/:schoolId', isAdminLoggedIn, loadIdCardDesign);
router.get('/school-designs/:schoolId', isAdminLoggedIn, getSchoolDesigns);
router.delete('/delete-design/:designId', isAdminLoggedIn, deleteDesign);

module.exports = router;
