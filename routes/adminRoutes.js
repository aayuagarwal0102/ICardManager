const express = require('express');
const router = express.Router();
const School = require('../models/School');
const Student = require('../models/Student');
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
    generateDesignedCards // Naya function import kiya gaya
} = require('../controllers/adminController');

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

// Yeh route editor se final design data receive karega
router.post('/generate-cards', isAdminLoggedIn, generateDesignedCards);

module.exports = router;