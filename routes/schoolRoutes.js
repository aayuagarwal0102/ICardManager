const express = require('express');
const { registerSchool, loginSchool , showRegisterPage,showLoginPage, dashboard, delete_teacher,edit_teacher, update_teacher,  save_teacher, logoutSchool, update_profile} = require('../controllers/schoolController');
const schoolController= require('../controllers/schoolController');
const Student = require("../models/Student");
const router = express.Router();
const { isSchoolLoggedIn } = require('../middleware'); // Import middleware
const {upload} = require("../config/multer"); 





router.get("/:id", dashboard);

router.post('/logout',logoutSchool);



router.post("/register", upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'signature', maxCount: 1 }
  ]) ,registerSchool);


router.post("/delete-class-teacher/:id",isSchoolLoggedIn, delete_teacher);

router.post("/:id/update-profile",upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "signature", maxCount: 1 }
  ]), update_profile);



router.post("/:id/add-class-teacher", isSchoolLoggedIn, save_teacher);


router.post("/:schoolId/edit-class-teacher/:teacherId", update_teacher);



module.exports = router;