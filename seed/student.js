const mongoose = require('mongoose');
const Student = require('../models/Student');
const School = require('../models/School');
const ClassTeacher = require("../models/ClassTeacher");

mongoose.connect('mongodb://127.0.0.1:27017/Icardmanager');

async function seedStudents() {
    const teachers = [
        {
          schoolId: "661f2c9e9b1a8a001e3d5f67",
          username: "teacher_101",
          password: "hashed_password_here", // bcrypt से hash करना ज़रूरी है
          fullName: "Rahul Sharma",
          class: "5A"
        },
        {
          schoolId: "661f2c9e9b1a8a001e3d5f67",
          username: "teacher_102",
          password: "hashed_password_here",
          fullName: "Neha Verma",
          class: "7B"
        }
      ];
      
      ClassTeacher.insertMany(teachers)
        .then(() => {
          console.log("Class Teachers Inserted!");
          mongoose.connection.close();
        })
        .catch(err => console.log(err));
}

seedStudents();
