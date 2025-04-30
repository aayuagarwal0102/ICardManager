const Student = require('../models/Student');

// 📌 Show Add Student Form
exports.showAddStudentForm = (req, res) => {
    res.render('student/addStudent');
};

// 📌 Add Student
exports.addStudent = async (req, res) => {
    try {
        const { studentName, rollNumber, className } = req.body;
        const newStudent = new Student({ studentName, rollNumber, className, schoolId: req.session.school._id });
        await newStudent.save();
        res.redirect('/student/list');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding student');
    }
};

// 📌 Show Edit Student Form
exports.showEditStudentForm = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).send('Student not found');
        res.render('student/editStudent', { student });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching student');
    }
};

// 📌 Edit Student
exports.editStudent = async (req, res) => {
    try {
        const { studentName, rollNumber, className } = req.body;
        await Student.findByIdAndUpdate(req.params.id, { studentName, rollNumber, className });
        res.redirect('/student/list');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating student');
    }
};

// 📌 Delete Student
exports.deleteStudent = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.redirect('/student/list');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting student');
    }
};

// 📌 List Students
exports.listStudents = async (req, res) => {
    try {
        const students = await Student.find({ schoolId: req.session.school._id }); // Show only logged-in school's students
        res.render('student/listStudents', { students });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching students');
    }
};
