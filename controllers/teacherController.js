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

module.exports.importStudentsFromExcel = async (req, res) => {
    // const teacherId = req.params.id;
    // if (!req.file) {
    //     req.flash('error_msg', 'No file uploaded.');
    //     return res.redirect(`/class-teacher/${teacherId}`);
    // }
    // try {
    //     const teacher = await ClassTeacher.findById(teacherId);
    //     const school = await School.findById(teacher.schoolId);
    //     const filePath = req.file.path;
    //     const workbook = xlsx.readFile(filePath);
    //     const sheetName = workbook.SheetNames[0];
    //     const sheet = workbook.Sheets[sheetName];
    //     const data = xlsx.utils.sheet_to_json(sheet, { defval: '' });
    //     let studentsToInsert = [];
    //     let rowIndex = 1;
    //     for (const row of data) {
    //         // Map Excel columns to schema fields
    //         const name = row['NAME'] || '';
    //         const fathername = row['F.NAME'] || '';
    //         const mothername = row['Mother Name'] || '';
    //         const studentClass = row['CLASS'] || teacher.class;
    //         const contact = row['MOBILE NO'] || '';
    //         const address = row['ADDRESS'] || '';
    //         const dob = row['DOB'] ? new Date(row['DOB']) : undefined;
    //         // Use row index as rollNo since it's missing
    //         const rollNo = rowIndex.toString();
    //         rowIndex++;
    //         // Only require name and fathername
    //         if (!name || !fathername) continue;
    //         // Check for duplicate (by name and fathername in this school)
    //         const exists = await Student.findOne({ name, fathername, schoolId: teacher.schoolId });
    //         if (exists) continue;
    //         studentsToInsert.push({
    //             rollNo,
    //             name,
    //             schoolId: teacher.schoolId,
    //             classTeacherId: teacher._id,
    //             schoolName: school.schoolName,
    //             class: studentClass,
    //             section: teacher.section,
    //             contact,
    //             address,
    //             dob,
    //             fathername,
    //             mothername,
    //             idCardStatus: 'Pending'
    //         });
    //     }
    //     if (studentsToInsert.length > 0) {
    //         await Student.insertMany(studentsToInsert);
    //         req.flash('success_msg', `${studentsToInsert.length} students imported successfully.`);
    //     } else {
    //         req.flash('error_msg', 'No new students were imported. Check for duplicates or missing required fields.');
    //     }
    //     res.redirect(`/class-teacher/${teacherId}`);
    // } catch (err) {
    //     console.log(err);
    //     req.flash('error_msg', 'Error importing students from Excel.');
    //     res.redirect(`/class-teacher/${teacherId}`);
    // }


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
      'dob': 'dob'
    };

    // Step 3: Map and save only valid fields
    const studentsToInsert = rawData.map(row => {
      const student = {};
      for (let excelKey in row) {
        const trimmedKey = excelKey.trim(); // Trim the key
        const schemaKey = excelToSchemaMap[trimmedKey];
        if (schemaKey && row[excelKey] !== undefined) {
          if (schemaKey === 'dob' && row[excelKey]) {
            student[schemaKey] = new Date(row[excelKey]);
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
          console.log(rawData);
            await Student.insertMany(studentsToInsert);
            req.flash('success_msg', `${studentsToInsert.length} students imported successfully.`);
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
        const teacher = await ClassTeacher.findById(teacherId);
        const students = await Student.find({ classTeacherId: teacherId });
        const totalStudents = students.length;
        const pendingCount = students.filter(s => s.idCardStatus === 'Pending').length;
        console.log('Total Students (No file):', totalStudents);
        return res.render('classTeacher/dashboard', { teacher, students, totalStudents, pendingCount, error_msg: req.flash('error_msg') });
    }

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            req.flash('error_msg', 'Student not found.');
            const teacher = await ClassTeacher.findById(teacherId);
            const students = await Student.find({ classTeacherId: teacherId });
            const totalStudents = students.length;
            const pendingCount = students.filter(s => s.idCardStatus === 'Pending').length;
            console.log('Total Students (Student not found):', totalStudents);
            return res.render('classTeacher/dashboard', { teacher, students, totalStudents, pendingCount, error_msg: req.flash('error_msg') });
        }

        // Update the student's photo
        student.photo = req.file.path;
        await student.save();

        req.flash('success_msg', 'Photo uploaded successfully.');
        const teacher = await ClassTeacher.findById(teacherId);
        const students = await Student.find({ classTeacherId: teacherId });
        const totalStudents = students.length;
        const pendingCount = students.filter(s => s.idCardStatus === 'Pending').length;
        console.log('Total Students (Success):', totalStudents);
        res.render('classTeacher/dashboard', { teacher, students, totalStudents, pendingCount, success_msg: req.flash('success_msg') });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error uploading photo.');
        const teacher = await ClassTeacher.findById(teacherId);
        const students = await Student.find({ classTeacherId: teacherId });
        const totalStudents = students.length;
        const pendingCount = students.filter(s => s.idCardStatus === 'Pending').length;
        console.log('Total Students (Error):', totalStudents);
        res.render('classTeacher/dashboard', { teacher, students, totalStudents, pendingCount, error_msg: req.flash('error_msg') });
    }
};
