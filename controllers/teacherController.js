const ClassTeacher = require('../models/ClassTeacher');
const Student = require('../models/Student');
const School=require('../models/School');
const xlsx = require('xlsx');
const path = require('path');

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
        req.flash("error_msg","Error loading dashboard");
        res.redirect(`/loginS`);
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

      if (existingStudent) {
         req.flash("error_msg","Roll number already exists in this school.");
        return  res.redirect(`/class-teacher/${teacherId}`);
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
            mothername, 
            house,
            nicCode,
            penNo,
            idCardStatus: 'Pending',
            photo: req.file ? req.file.path : null
        });

        await student.save();
        req.flash("success_msg","added successfully");
        res.redirect(`/class-teacher/${teacherId}`);
    } catch (err) {
       req.flash("error_msg","Error adding student");
        res.redirect(`/class-teacher/${teacherId}`);
    }
};

module.exports.logout =  (req, res) => {
    req.session.destroy((err) => {
       
        res.clearCookie("connect.sid");
        
        res.redirect("/loginS");
    });
};

// Helper to parse date in DD-MM-YYYY or DD/MM/YYYY format
function parseExcelDate(dateVal) {
  if (!dateVal) return null;
  if (dateVal instanceof Date) return dateVal;
  // Handle Excel serial numbers
  if (typeof dateVal === 'number') {
    // Excel's epoch starts at 1899-12-30
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    excelEpoch.setUTCDate(excelEpoch.getUTCDate() + dateVal);
    return excelEpoch;
  }
  // If it's a string in DD-MM-YYYY or DD/MM/YYYY
  const match = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(dateVal);
  if (match) {
    const [ , dd, mm, yyyy ] = match;
    return new Date(`${yyyy}-${mm}-${dd}`);
  }
  // Fallback: try Date constructor
  return new Date(dateVal);
}

module.exports.importStudentsFromExcel = async (req, res) => {
   
     try {
    if (!req.file) return res.status(400).send('No file uploaded');

    const teacherId = req.params.id;
       const teacher = await ClassTeacher.findById(teacherId);
      const school = await School.findById(teacher.schoolId);

      console.log(teacher);
      console.log(school);

    // Step 1: Read the Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = xlsx.utils.sheet_to_json(sheet);

    // Step 2: Allowed fields as per your schema
    const allowedFields = [
      'rollNo', 'name', 'class', 'contact', 'address',
      'dob', 'section', 'fathername', 'mothername',
      'house', 'nicCode', 'penNo'
    ];

    const excelToSchemaMap = {
      'name': 'name',
      'fathername': 'fathername',
      'mothername': 'mothername',
      'class': 'class',
      'contact': 'contact',
      'address': 'address',
      'dob': 'dob',
      'rollNo': 'rollNo',
      'house': 'house',
      'nicCode': 'nicCode',
      'penNo': 'penNo',
      'section': 'section'
    };

    // Step 3: Map and save only valid fields
    const studentsToInsert = rawData.map(row => {
      const student = {};
      for (let excelKey in row) {
        const trimmedKey = excelKey.trim(); // Trim the key
        const schemaKey = excelToSchemaMap[trimmedKey];
        if (schemaKey && row[excelKey] !== undefined) {
          if (schemaKey === 'dob' && row[excelKey]) {
            const excelDate = parseInt(row[excelKey], 10);
            if (!isNaN(excelDate)) {
              // Excel date serial number to JavaScript Date
              const jsDate = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
              student[schemaKey] = jsDate;
            } else {
              student[schemaKey] = null; // or handle invalid date case as needed
            }
          } else {
            student[schemaKey] = row[excelKey];
          }
        }
      }
      // Add default fields
      student.idCardStatus = 'Pending';
      student.section = teacher.section;
      student.schoolId = teacher.schoolId;
      student.classTeacherId = teacherId;
      student.schoolName = school.schoolName;
      return student;
    });

    if (studentsToInsert.length > 0) {
          try {
            await Student.insertMany(studentsToInsert);
            req.flash('success_msg', `${studentsToInsert.length} students imported successfully.`);
          } catch (insertErr) {
            console.error('Error inserting students:', insertErr); // Log insertion error
            req.flash('error_msg', 'Error inserting students into the database.');
          }
        } else {
            req.flash('error_msg', 'No new students were imported. Check for duplicates or missing required fields.');
        }

        res.redirect(`/class-teacher/${teacherId}`);

  } catch (err) {
     req.flash('error_msg', 'Error importing students from Excel.');
       res.redirect(`/class-teacher/${teacherId}`);
  }
};

module.exports.uploadStudentPhoto = async (req, res) => {
    const { teacherId, studentId } = req.params;

    console.log('Teacher ID:', teacherId);
    console.log('Student ID:', studentId);
    console.log('Uploaded File:', req.file);

    if (!req.file) {
        req.flash('error_msg', 'No file uploaded.');
        return res.redirect(`/class-teacher/${teacherId}`);
    }

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            req.flash('error_msg', 'Student not found.');
            return res.redirect(`/class-teacher/${teacherId}`);
        }

        // The image is already cropped on the frontend using CropperJS
        // Just save the path of the cropped image
        student.photo = req.file.path;
        await student.save();

        req.flash('success_msg', 'Photo uploaded and cropped successfully.');
        res.redirect(`/class-teacher/${teacherId}`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error uploading photo.');
        res.redirect(`/class-teacher/${teacherId}`);
    }
};
