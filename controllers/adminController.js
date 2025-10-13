const bcrypt = require('bcryptjs');
const School = require('../models/School');
const ClassTeacher = require("../models/ClassTeacher");
const Student = require('../models/Student');
const QRCode = require('qrcode');
const Template = require('../models/template');

// 📌 Show Admin Login Page
exports.showLoginPage = (req, res) => {
    const token = req.query.key;
    if (token !== process.env.SUPER_ADMIN_SECRET_KEY) {
        req.flash("error_msg", "Access Denied");
        return res.redirect("/registerS");
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
        req.flash("error_msg", "Invalid Credientials");
        res.render("admin/login", { error_msg: req.flash("error_msg") });
    }
};

exports.dashboard = async (req, res) => {
    try {
        const totalSchools = await School.countDocuments();
        const totalStudents = await Student.countDocuments();
        const pendingRequests = await Student.countDocuments({ idCardStatus: "Pending" });
        const schools = await School.find();
        const pendingStudents = await Student.find({ idCardStatus: "Pending" }).populate("schoolId", "schoolName");
        res.render("admin/dashboard", { layout: "layouts/boilerplate", totalSchools, totalStudents, pendingRequests, pendingStudents });
    } catch (error) {
        req.flash("error_msg", "error loading dashboard, internal error ");
        res.render("admin/login", { error_msg: req.flash("error_msg") });
    }
};

exports.getSchools = async (req, res) => {
    const schools = await School.find();
    try {
        res.render("admin/schools", { layout: "layouts/boilerplate", schools });
    } catch (err) {
        req.flash("error_msg", "Error fetching schools");
        return res.redirect("/admin/dashboard");
    }
};

exports.printStudentId = async (req, res) => {
    try {
        const selectedIds = req.body.selectedStudents;
        const ids = selectedIds ? (Array.isArray(selectedIds) ? selectedIds : [selectedIds]) : [];

        if (ids.length === 0) {
            req.flash("error_msg", "Please select at least one student.");
            return res.redirect("back");
        }

        const students = await Student.find({ _id: { $in: ids } });

        if (!students || students.length === 0) {
            req.flash("error_msg", "Selected students could not be found.");
            return res.redirect("back");
        }

        const template = await Template.findOne({ name: 'Default Template' });

        if (!template) {
            req.flash("error_msg", "Default ID card template not found in the database!");
            return res.redirect("back");
        }

        res.render('admin/print-id', {
            students: students,
            template: template,
            layout: false
        });

    } catch (error) {
        console.error("Error loading ID card editor:", error);
        req.flash("error_msg", "An error occurred while loading the editor.");
        return res.redirect("back");
    }
};

exports.select_students = async (req, res) => {
    const { schoolId, classId } = req.params;
    const students = await Student.find({ classTeacherId: classId });
    if (!students || students.length == 0) {
        req.flash("error_msg", "there no such students find, ask school");
        return res.redirect("/admin/schools");
    }
    res.render('admin/students', { students, schoolId, classId });
};

exports.get_classes = async (req, res) => {
    const schoolId = req.params.id;
    const classes = await ClassTeacher.find({ schoolId });
    if (!classes || classes.length == 0) {
        req.flash("error_msg", "there no such classes find, ask school");
        return res.redirect("/admin/schools");
    }
    res.render('admin/classes', { layout: "layouts/boilerplate", classes, schoolId });
};

exports.select_template = async (req, res) => {
    try {
        const templates = [
            { name: "Template 1", value: "template1" },
            { name: "Template 2", value: "template2" },
            { name: "Template 3", value: "template3" },
            { name: "Template 4", value: "template4" },
            { name: "Template 5", value: "template5" },
            { name: "Template 6", value: "template6" }
        ];
        res.render('admin/card-design', { templates });
    } catch (err) {
        req.flash("error_msg", "internal error to select id cards");
        return res.redirect("/admin/select-template");
    }
};

exports.save_template = (req, res) => {
    const { selectedTemplate } = req.body;
    req.session.selectedTemplate = selectedTemplate;
    res.redirect('/admin/dashboard');
};

// =================================================================
// ===== NAYA CONTROLLER FUNCTION YAHAAN ADD KIYA GAYA HAI =====
// =================================================================
exports.generateDesignedCards = async (req, res) => {
    try {
        // editor.js se bheja gaya design aur students ka data receive karo
        const { design, students } = req.body;

        if (!design || !students || students.length === 0) {
            return res.status(400).send('Missing design or student data.');
        }

        // Student ka ID Card status "Generated" par update karo
        const studentIds = students.map(s => s._id);
        await Student.updateMany(
            { _id: { $in: studentIds } },
            { $set: { idCardStatus: "Generated" } }
        );

        // Nayi EJS file 'final-cards.ejs' ko render karo jo sab cards ko display karegi
        res.render('admin/final-cards', {
            design: design,
            students: students,
            layout: false // Hum yahan bhi main layout use nahi karenge
        });

    } catch (error) {
        console.error("Error generating final cards:", error);
        res.status(500).send('An error occurred while generating the cards.');
    }
};
// =================================================================
// ===== NAYA FUNCTION ENDS HERE =====
// =================================================================

exports.logoutAdmin = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/admin/login?key=" + process.env.SUPER_ADMIN_SECRET_KEY);
    });
};