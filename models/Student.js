const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    rollNo: { type: String, trim: true },
    name: { type: String, trim: true },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    classTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'classteacher' },
    schoolName: { type: String },
    class: { type: String, trim: true },
    contact: { type: String, },
    address: { type: String, trim: true },
    dob: { type: Date },
    section: { type: String, trim: true },
    fathername: { type: String, trim: true },
    mothername: { type: String, trim: true },
    house: { type: String, trim: true },
    nicCode: { type: String, trim: true },
    penNo: { type: String, trim: true },
    photo: { type: String },
    idCardStatus: { type: String, enum: ['Pending', 'Generated'], default: 'Pending' }
});

module.exports = mongoose.model('Student', studentSchema);


// house , mother name(required) , nic code , pen no. ,   