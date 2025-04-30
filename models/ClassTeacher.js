const mongoose = require("mongoose");

const ClassTeacherSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true }, 
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    class: { type: String, required: true },
    section: {type:String}, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ClassTeacher", ClassTeacherSchema);
