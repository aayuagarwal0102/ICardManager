const mongoose = require("mongoose");

const ClassTeacherSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true }, 
    username: { type: String, required: true, unique: true },
    password: { type: String, required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'] },
    fullName: { type: String, required: [true, 'Full name is required'],
        trim: true},
    class: { type: String, required: [true, 'Class is required'],
        trim: true },
    section: {type:String, required: [true, 'Section is required'],
        trim: true}, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ClassTeacher", ClassTeacherSchema);
