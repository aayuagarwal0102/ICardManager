const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
    schoolName: { type: String, required: [true, 'School name is required'] },
    email: { type: String, required: true, unique: true , match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']},
    password: { type: String, required: true ,  minlength: [6, 'Password must be at least 6 characters long']},
    address: { type: String, required: true, trim: true },  //  Address Field
    contactNumber: { type: String, required: true, match: [/^[0-9]{10}$/, 'Contact number must be 10 digits'] }, //  Contact Number Field
    createdAt: { type: Date, default: Date.now },
    logo: { type: String },
    signature :  { type: String },
    city: {type: String, required: true },
    affnumber : {type: String,  required: [true, 'Affiliation number is required']},

});

module.exports = mongoose.model('School', SchoolSchema);