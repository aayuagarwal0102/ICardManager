const bcrypt = require('bcryptjs');

const School = require('../models/School'); // Import School Model
const ClassTeacher= require("../models/ClassTeacher");
const Student = require('../models/Student');
const IdCardDesign = require('../models/IdCardDesign');
const QRCode = require('qrcode');



// 📌 Show Admin Login Page
exports.showLoginPage = (req, res) => {
    const token = req.query.key;
    if (token !== process.env.SUPER_ADMIN_SECRET_KEY) {
        req.flash("error_msg","Access Denied");
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
        req.flash("error_msg","Invalid Credientials");
        res.render("admin/login", {error_msg: req.flash("error_msg")});
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

         
         
       
        res.render("admin/dashboard", { layout: "layouts/boilerplate", totalSchools, totalStudents, pendingRequests ,pendingStudents});
    } catch (error) {
        req.flash("error_msg","error loading dashboard, internal error ");
        res.render("admin/login", {error_msg: req.flash("error_msg")});
    }
};

exports.getSchools = async (req, res) => {
    const schools = await School.find(); // all students

    try {
    res.render("admin/schools", { layout: "layouts/boilerplate", schools});
    }
    catch(err){
        req.flash("error_msg","Error fetching schools");
        return res.redirect("/admin/dashboard");
    }
};


exports.printStudentId = async (req, res) => {
    
    try {
        const selectedIds = req.body.selectedStudents;
        const ids = Array.isArray(selectedIds) ? selectedIds : [selectedIds];

        if (ids.length < 1) {
            req.flash("error_msg","select minimum 1");
           return res.redirect("/admin/dashboard");
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

        // Fetch the teacher object
        const teacher = await ClassTeacher.findById(students[0].classTeacherId);

        // Try to load saved design for this school
        let savedDesign = null;
        try {
            const design = await IdCardDesign.findOne({ 
                schoolId: students[0].schoolId, 
                isDefault: true 
            });
            savedDesign = design;
        } catch (error) {
            console.log('No saved design found for school:', students[0].schoolId);
        }

        // Get selected template from session or use saved design template
        let selectedTemplate = req.session.selectedTemplate || 'template1';
        if (savedDesign && savedDesign.template) {
            selectedTemplate = savedDesign.template;
        }

        // Render with saved design data
        res.render(`templates/${selectedTemplate}`, { 
            studentsWithQr, 
            school, 
            teacher,
            savedDesign: savedDesign 
        });

    } catch (error) {
        req.flash("error_msg","Error printing multiple ID cards:");
        return res.redirect("/admin/dashboard");
       
    }
};

exports.select_students=  async (req, res) => {
    const { schoolId, classId } = req.params;
  
    // Fetch students of that class
    const students = await Student.find({ classTeacherId: classId });

    if(!students || students.length==0){
        req.flash("error_msg","there no such students find, ask school");
        return res.redirect("/admin/schools");
    }
  
    res.render('admin/students',{ students, schoolId, classId });
  };

  exports.get_classes=async (req, res) => {
    const schoolId = req.params.id;
    
    const classes = await ClassTeacher.find({ schoolId });

     if(!classes || classes.length==0){
        req.flash("error_msg","there no such classes find, ask school");
        return res.redirect("/admin/schools");
    }
  
    res.render('admin/classes', { layout: "layouts/boilerplate", classes, schoolId });
    };

    exports.select_template=async (req, res) => {
        try {
    
          const templates = [
            { name: "Template 1", value: "template1" },
            { name: "Template 2", value: "template2" },
            { name: "Template 3", value: "template3" },
            { name: "Template 4", value: "template4" },
            { name: "Template 5", value: "template5" },
            { name: "Template 6", value: "template6" }
          ];
    
          res.render('admin/card-design',{templates});
      } catch (err) {
        req.flash("error_msg","internal error to select id cards");
        return res.redirect("/admin/select-template");
      }
    
    
        };

     exports.save_template= (req, res) => {
         const { selectedTemplate } = req.body;
         req.session.selectedTemplate = selectedTemplate; // store template in session
        
         res.redirect('/admin/dashboard'); // or wherever you want
       };







//  Logout Admin
exports.logoutAdmin = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/admin/login?key=" + process.env.SUPER_ADMIN_SECRET_KEY);
    });
};

// Save ID Card Design for School
exports.saveIdCardDesign = async (req, res) => {
    try {
        const { schoolId, designName, template, fields, styling, photoSettings } = req.body;
        
        // Check if a default design already exists for this school
        const existingDefault = await IdCardDesign.findOne({ 
            schoolId, 
            isDefault: true 
        });

        if (existingDefault) {
            // Update existing default design
            existingDefault.designName = designName || existingDefault.designName;
            existingDefault.template = template || existingDefault.template;
            existingDefault.fields = fields || existingDefault.fields;
            existingDefault.styling = styling || existingDefault.styling;
            existingDefault.photoSettings = photoSettings || existingDefault.photoSettings;
            
            await existingDefault.save();
            return res.json({ success: true, message: 'Design updated successfully', designId: existingDefault._id });
        } else {
            // Create new default design
            const newDesign = new IdCardDesign({
                schoolId,
                designName: designName || 'Default Design',
                template: template || 'template2',
                fields: fields || [],
                styling: styling || {
                    backgroundColor: '#ffffff',
                    fontFamily: 'Arial',
                    fontSize: 7,
                    fieldTextColor: '#222222',
                    backgroundImage: null
                },
                photoSettings: photoSettings || {
                    position: { left: 0, top: 0 },
                    size: { width: 2.5, height: 3.2 }
                },
                isDefault: true
            });
            
            await newDesign.save();
            return res.json({ success: true, message: 'Design saved successfully', designId: newDesign._id });
        }
    } catch (error) {
        console.error('Error saving ID card design:', error);
        return res.status(500).json({ success: false, message: 'Error saving design' });
    }
};

// Load ID Card Design for School
exports.loadIdCardDesign = async (req, res) => {
    try {
        const { schoolId } = req.params;
        
        // Find the default design for this school
        const design = await IdCardDesign.findOne({ 
            schoolId, 
            isDefault: true 
        });

        if (!design) {
            return res.json({ 
                success: false, 
                message: 'No saved design found for this school',
                design: null 
            });
        }

        return res.json({ 
            success: true, 
            message: 'Design loaded successfully',
            design: design 
        });
    } catch (error) {
        console.error(' loading ID card design:', error);
        return res.status(500).json({ success: false, message: 'Error loading design' });
    }
};

// Get all designs for a school
exports.getSchoolDesigns = async (req, res) => {
    try {
        const { schoolId } = req.params;
        
        const designs = await IdCardDesign.find({ schoolId }).sort({ createdAt: -1 });
        
        return res.json({ 
            success: true, 
            designs: designs 
        });
    } catch (error) {
        console.error('Error fetching school designs:', error);
        return res.status(500).json({ success: false, message: 'Error fetching designs' });
    }
};

// Delete a design
exports.deleteDesign = async (req, res) => {
    try {
        const { designId } = req.params;
        
        const design = await IdCardDesign.findByIdAndDelete(designId);
        
        if (!design) {
            return res.status(404).json({ success: false, message: 'Design not found' });
        }

        return res.json({ success: true, message: 'Design deleted successfully' });
    } catch (error) {
        console.error('Error deleting design:', error);
        return res.status(500).json({ success: false, message: 'Error deleting design' });
    }
};