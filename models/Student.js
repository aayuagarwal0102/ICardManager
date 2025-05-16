const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    rollNo: { type: String, required: [true, 'Roll number is required'],
        trim: true},
    name: { type: String,  required: [true, 'Student name is required'],
        trim: true },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    classTeacherId : {type: mongoose.Schema.Types.ObjectId, ref: 'classteacher', required: true},
    schoolName: { type: String, required: true },
    class: { type: String, required: [true, 'Class is required'],
        trim: true},
    contact: { type: String, required: [true, 'Contact number is required'],
        match: [/^[0-9]{10}$/, 'Contact number must be 10 digits'] },
    address: { type: String, required: [true, 'Address is required'],
        trim: true },
    dob: { type: Date, required: [true, 'Date of birth is required'] },
    section :{type : String, required: [true, 'Section is required'],
        trim: true },
    fathername: { type: String, required: [true, 'Father\'s name is required'],
        trim: true },
    photo :{type: String, required: [true, 'Photo is required']},
    idCardStatus: { type: String, enum: ['Pending', 'Generated'], default: 'Pending' }
});

module.exports = mongoose.model('Student', studentSchema);


// house , mother name(required) , nic code , pen no. ,   