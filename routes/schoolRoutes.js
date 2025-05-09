const express = require('express');
const { registerSchool, dashboard, delete_teacher, update_teacher,  save_teacher, logoutSchool, update_profile, forgot_pass, verify_otp, set_new_password} = require('../controllers/schoolController');
const schoolController= require('../controllers/schoolController');
const Student = require("../models/Student");
const router = express.Router();
const { isSchoolLoggedIn } = require('../middleware'); // Import middleware
const {upload} = require("../config/multer"); 






router.post('/logout',isSchoolLoggedIn,logoutSchool);



router.get('/forgot-password', schoolController.get_forgot);

router.post('/forgot-password', forgot_pass);


// Verify OTP
router.post('/verify-otp', verify_otp);

// Save new password
router.post('/set-new-password',set_new_password);


router.post("/register", upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'signature', maxCount: 1 }
  ]) ,registerSchool);


router.post("/delete-class-teacher/:id",isSchoolLoggedIn, delete_teacher);

router.get("/:id",isSchoolLoggedIn, dashboard);


router.post("/:id/update-profile",isSchoolLoggedIn,upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "signature", maxCount: 1 }
  ]), update_profile);



router.post("/:id/add-class-teacher", isSchoolLoggedIn, save_teacher);


router.post("/:schoolId/edit-class-teacher/:teacherId",isSchoolLoggedIn, update_teacher);



module.exports = router;