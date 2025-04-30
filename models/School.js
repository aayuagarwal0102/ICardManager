const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
    schoolName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },  //  Address Field
    contactNumber: { type: String, required: true }, //  Contact Number Field
    createdAt: { type: Date, default: Date.now },
    logo: { type: String },
    signature :  { type: String },
    city: {type: String, required: true },
    affnumber : {type: String, required: true},

});

module.exports = mongoose.model('School', SchoolSchema);