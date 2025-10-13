const express = require('express');
const router = express.Router();
const School = require('../models/School');
const Student = require('../models/Student');
<<<<<<< HEAD
const ClassTeacher = require("../models/ClassTeacher");

// Controller functions ko import karein
const {
    loginAdmin,
    showLoginPage,
    dashboard,
    logoutAdmin,
    getSchools,
    select_students,
    get_classes,
    select_template,
    save_template,
    printStudentId,
    generateDesignedCards // <-- 1. YEH NAYA FUNCTION IMPORT KAREIN
} = require('../controllers/adminController');

=======
const ClassTeacher= require("../models/ClassTeacher");
const  {loginAdmin, showLoginPage, dashboard, logoutAdmin, getSchools , select_students, get_classes, select_template, save_template, printStudentId, saveIdCardDesign, loadIdCardDesign, getSchoolDesigns, deleteDesign} = require('../controllers/adminController');
>>>>>>> f044f4b92d8afad9b5da208f8e7b02c9a374a8b0
const { isAdminLoggedIn } = require('../middleware'); // Import middleware

// Routes
router.post('/login', loginAdmin);
router.get('/login', showLoginPage);
router.get("/dashboard", isAdminLoggedIn, dashboard);
router.get('/logout', isAdminLoggedIn, logoutAdmin);

router.get('/schools', isAdminLoggedIn, getSchools);
router.get('/schools/:id/classes', isAdminLoggedIn, get_classes);
router.get('/schools/:schoolId/classes/:classId/students', isAdminLoggedIn, select_students);

router.get('/select-template', isAdminLoggedIn, select_template);
router.post('/select-template', isAdminLoggedIn, save_template);

router.post('/print-id', isAdminLoggedIn, printStudentId);

// ===== 2. YEH NAYA ROUTE ADD KAREIN =====
// Yeh route editor se final design data receive karega
router.post('/generate-cards', isAdminLoggedIn, generateDesignedCards);
// =========================================

<<<<<<< HEAD
module.exports = router;
=======


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
>>>>>>> f044f4b92d8afad9b5da208f8e7b02c9a374a8b0
