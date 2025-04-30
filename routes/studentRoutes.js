const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { isSchoolLoggedIn } = require('../middleware'); // Import middleware

//  Add Student (Only if logged in)
router.get('/add', isSchoolLoggedIn, studentController.showAddStudentForm);
router.post('/add', isSchoolLoggedIn, studentController.addStudent);

//  Edit Student (Only if logged in)
router.get('/edit/:id', isSchoolLoggedIn, studentController.showEditStudentForm);
router.post('/edit/:id', isSchoolLoggedIn, studentController.editStudent);

//  Delete Student (Only if logged in)
router.get('/delete/:id', isSchoolLoggedIn, studentController.deleteStudent);

//  List Students (Only if logged in)
router.get('/list', isSchoolLoggedIn, studentController.listStudents);

module.exports = router;

