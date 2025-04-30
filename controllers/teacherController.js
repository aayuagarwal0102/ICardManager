const ClassTeacher = require('../models/ClassTeacher');
const Student = require('../models/Student');
const School=require('../models/School');

module.exports.getDashboard = async (req, res) => {
    const teacherId = req.params.id;

    try {
        const teacher = await ClassTeacher.findById(teacherId);
        const students = await Student.find({ classTeacherId: teacherId });

        const totalStudents = students.length;
        const pendingCount = students.filter(s => s.idCardStatus === 'Pending').length;

        res.render('classTeacher/dashboard', {
            teacher,
            totalStudents,
            pendingCount,
            students
        });
    } catch (err) {
        console.error(err);
        res.send('Error loading dashboard');
    }
};

module.exports.saveStudent= async (req, res) => {
    const teacherId = req.params.id;
    const {
        rollNo, name, fathername, contact, address, dob
    } = req.body;

    const  teacher= await ClassTeacher.findById(teacherId);
    
    const existingStudent = await Student.findOne({ 
        rollNo: rollNo, 
        schoolId: teacher.schoolId,
      });

      console.log(teacher.schoolId);

      if (existingStudent) {
        return res.status(400).send("Roll number already exists in this school.");
      }

    try {
        const teacher = await ClassTeacher.findById(teacherId);
        const school= await School.findById(teacher.schoolId);
        const student = new Student({
            rollNo,
            name,
            schoolId: teacher.schoolId,
            classTeacherId: teacher._id,
            schoolName: school.schoolName, 
            class: teacher.class,
            section: teacher.section,
            contact,
            address,
            dob,
            fathername,
            photo: req.file ? req.file.path : null
        });

        await student.save();
        req.flash("success_msg","added successfully");
        res.redirect(`/class-teacher/${teacherId}`);
    } catch (err) {
        console.error(err);
        res.send('Error adding student');
    }
};

module.exports.logout =  (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Logout error:", err);
            return res.send("Error logging out");
        }
        res.clearCookie("connect.sid");
        
        res.redirect("/loginS");
    });
};
