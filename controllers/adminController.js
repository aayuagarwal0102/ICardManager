const bcrypt = require('bcryptjs');

const School = require('../models/School'); // Import School Model
const Student = require('../models/Student');
const QRCode = require('qrcode');



// 📌 Show Admin Login Page
exports.showLoginPage = (req, res) => {
    const token = req.query.key;
    if (token !== process.env.SUPER_ADMIN_SECRET_KEY) {
        return res.status(403).send("Access Denied ❌");
    }
   
    res.render('admin/login');
};

// 📌 Admin Login Logic
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (
        email === process.env.SUPER_ADMIN_EMAIL &&
        password === process.env.SUPER_ADMIN_PASSWORD
    ) {
        req.session.role = "admin";
        return res.redirect("/admin/dashboard");
    } else {
        return res.render("admin/login", { error: "Invalid credentials" });
    }
};

exports.dashboard = async (req, res) => {
    try {

        const totalSchools = await School.countDocuments();
        const totalStudents = await Student.countDocuments();
        const pendingRequests = await Student.countDocuments({ idCardStatus: "Pending" });

        const schools = await School.find(); // all students

         // Fetch all students whose ID card is pending
         const pendingStudents = await Student.find({ idCardStatus: "Pending" }).populate("schoolId", "schoolName");

         const templates = [
            { name: "Template 1", value: "template1" },
            { name: "Template 2", value: "template2" },
            { name: "Template 3", value: "template3" },
            { name: "Template 4", value: "template4" },
            { name: "Template 5", value: "template5" },
            { name: "Template 6", value: "template6" }
          ];

        res.render("admin/dashboard", { schools, totalSchools, totalStudents, pendingRequests ,pendingStudents,templates });
    } catch (error) {
        res.status(500).send("Error loading dashboard");
    }
};




// 📌 Show Manage Schools Page
exports.manageSchools = async (req, res) => {
    try {
        const schools = await School.find(); // Fetch all schools from database
        res.render('admin/manageSchools', { schools });
    } catch (err) {
        res.status(500).send("Error fetching schools");
    }
};

// 📌 Delete School
exports.deleteSchool = async (req, res) => {
    try {
        const schoolId = req.params.id;
        await School.findByIdAndDelete(schoolId);
        res.redirect('/admin/manage-schools');
    } catch (err) {
        res.status(500).send("Error deleting school");
    }
};



exports.getSchoolDetails = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).send("School not found");
        }

        const students = await Student.find({ schoolId: school._id });

        res.render('admin/schoolDetails', { school, students });
    } catch (error) {
        res.status(500).send("Error loading school details");
    }
};





exports.printStudentId = async (req, res) => {
    // try {
    //     const student = await Student.findById(req.params.studentId);
    //     const school =await School.findById(student.schoolId);

    //     const ids = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
    //     if (ids.length < 1 || ids.length > 9) {
    //         return res.status(400).send("You must select between 1 to 9 students.");
    //     }

    //     if (!student) {
    //         return res.status(404).send("Student Not Found");
    //     }

    //     // QR Code Data
    //     const qrData = JSON.stringify({
    //         name: student.name,
    //         rollNo: student.rollNo,
    //         class: student.class,
    //         school: student.schoolName
    //     });

    //     // Generate QR Code
    //     const qrCode = await QRCode.toDataURL(qrData);

    //     // Update ID Card Status to "Generated"
    //     student.idCardStatus = "Generated";
    //     await student.save();


    //     const selectedTemplate = req.session.selectedTemplate || 'template1';
    //     // Render ID Card Page
    //     res.render(`templates/${selectedTemplate}`, { student, qrCode ,school});

    // } catch (error) {
    //     console.error("Error printing ID card:", error);
    //     res.status(500).send("Internal Server Error");
    // }
    try {
        const selectedIds = req.body.selectedStudents;
        const ids = Array.isArray(selectedIds) ? selectedIds : [selectedIds];

        if (ids.length < 1 || ids.length > 50) {
            return res.status(400).send("You must select between 1 to 9 students.");
        }

        // Fetch Students
        const students = await Student.find({ _id: { $in: ids } });

    

        // Generate QR Codes for Each Student
        const studentsWithQr = await Promise.all(students.map(async (student) => {
            const qrData = JSON.stringify({
                name: student.name,
                rollNo: student.rollNo,
                class: student.class,
                school: student.schoolName
            });

            const qrCode = await QRCode.toDataURL(qrData);

            // Update ID Card Status to "Generated"
            student.idCardStatus = "Generated";
            await student.save();

            return { student, qrCode };
        }));

        // Get School (assume all students are from same school)
        const school = await School.findById(students[0].schoolId);

        // Get selected template from session
        const selectedTemplate = req.session.selectedTemplate || 'template1';

        // Render
        res.render(`templates/${selectedTemplate}`, { studentsWithQr, school });

    } catch (error) {
        console.error("Error printing multiple ID cards:", error);
        res.status(500).send("Internal Server Error");
    }
};





//  Logout Admin
exports.logoutAdmin = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/admin/login?key=" + process.env.SUPER_ADMIN_SECRET_KEY);
    });
};





