const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    rollNo: { type: String, required: true},
    name: { type: String, required: true },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    classTeacherId : {type: mongoose.Schema.Types.ObjectId, ref: 'classteacher', required: true},
    schoolName: { type: String, required: true },
    class: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    dob: { type: Date, required: true },
    section :{type : String },
    fathername: { type: String, required: true },
    photo :{type: String},
    idCardStatus: { type: String, enum: ['Pending', 'Generated'], default: 'Pending' }
});

module.exports = mongoose.model('Student', studentSchema);
