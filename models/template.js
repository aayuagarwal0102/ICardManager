const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Yeh sub-schema define karta hai ki card par har ek element (jaise text, photo) kaisa hoga
const elementSchema = new Schema({
    type: { // Element ka type: 'text', 'image', 'shape', etc.
        type: String,
        required: true
    },
    content: { // Text ke liye placeholder (jaise {{student.name}}) ya image ke liye URL
        type: String
    },
    x: { type: Number, default: 0 }, // X-position
    y: { type: Number, default: 0 }, // Y-position
    width: { type: Number, default: 100 },
    height: { type: Number, default: 20 },
    
    // Text-specific properties
    fontFamily: { type: String, default: 'Roboto' },
    fontSize: { type: Number, default: 12 },
    fontWeight: { type: String, default: 'normal' }, // 'normal', 'bold'
    fontStyle: { type: String, default: 'normal' }, // 'normal', 'italic'
    textDecoration: { type: String, default: 'none' }, // 'none', 'underline'
    color: { type: String, default: '#000000' }
});


// Yeh main template ka schema hai
const templateSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    layout: { // 'single' ya 'double' sided
        type: String,
        default: 'single'
    },
    width: { // mm mein
        type: Number,
        default: 85.6
    },
    height: { // mm mein
        type: Number,
        default: 54
    },
    backgroundImage: { // Background image ka path
        type: String
    },
    // Yeh array card par maujood saare elements (naam, photo, roll no) ki details rakhega
    elements: [elementSchema] 
});

module.exports = mongoose.model('template', templateSchema);