const express = require("express");
const bcrypt = require("bcryptjs");
const ClassTeacher = require("../models/ClassTeacher");
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const {upload, uploadExcel} = require("../config/multer");

const { isTeacherLoggedIn } = require('../middleware');

// Dashboard Route
router.get('/:id', isTeacherLoggedIn, teacherController.getDashboard);

router.post('/:id/add-student', isTeacherLoggedIn, upload.single('photo'), teacherController.saveStudent );

router.post('/:id/upload-students-excel', isTeacherLoggedIn, uploadExcel.single('excelFile'), teacherController.importStudentsFromExcel );

router.post('/logout', isTeacherLoggedIn,teacherController.logout);

router.post('/:teacherId/upload-photo/:studentId', isTeacherLoggedIn, upload.single('photo'), teacherController.uploadStudentPhoto);

module.exports = router;
