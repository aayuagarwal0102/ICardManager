const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const flash = require("connect-flash");
require('dotenv').config();
const nodemailer= require("nodemailer");

const app = express();
connectDB();  // Connect MongoDB

const path = require("path");
const session= require("express-session");
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const schoolRouter= require("./routes/schoolRoutes.js");
const studentRouter= require("./routes/studentRoutes.js");
const adminRouter= require("./routes/adminRoutes.js");
const authRoute= require("./routes/auth.js");
const teacherRoute=  require("./routes/teacherRoutes.js");
const {isAlreadyLoggedIn } = require('./middleware');

app.use(express.urlencoded({ extended: true })); // Form Data Read
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));




app.use(express.json());
app.use(cors());

app.use(session({
    secret: 'aayu',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 120 // 120 minutes
    }
    
}));

app.use(flash());

app.use((req, res, next) => {
    
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});



app.get("/getOtp",(req,res)=>{
    res.render("otp.ejs");
})

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // TLS
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });


    app.post("/send-otp", async (req, res) => {
       
        const otp = generateOtp();
        req.session.otp = otp;

        const { schoolName, contactNumber, email } = req.body;

  // Store in session
  req.session.tempSchoolData = { schoolName, contactNumber, email };

        
      
        try {
          await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Your OTP Code for register your school",
            text: `Your OTP is: ${otp}, please enter it to verify`
          });
          res.render('school/register.ejs', { showOtpStep: true, showFinalStep: false });
        } catch (error) {
          console.log(error);
          res.send("Failed to send OTP.");
        }

      });

      
      app.get('/resend-otp', async (req, res) => {
    
        if (!email || !contactNumber || !schoolName) {
            return res.redirect('/registerS'); // if session expired
        }
    
        const otp=generateOtp();
        req.session.otp = otp;
        req.session.otpExpiresAt = Date.now() + 2 * 60 * 1000;
    
        // use nodemailer or your sendOtp function
        try {
          await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Your OTP Code for register your school",
            text: `Your OTP is: ${otp}, please enter it to verify`
          });
          res.render('school/register.ejs', { showOtpStep: true, showFinalStep: false  });
        } catch (error) {
          console.log(error);
          res.send("Failed to send OTP.");
        }
    
     
    });
    


  app.post("/verify-otp", (req, res) => {
    const userOtp = req.body.otp.join("");
    if (userOtp === req.session.otp) {
      const schoolData = req.session.tempSchoolData;
      console.log(schoolData);
      req.session.otp = null;
     return res.render('school/register.ejs',  { showOtpStep: false, showFinalStep: true });
    } else {
      
      res.render('school/register.ejs',  { showOtpStep: true, showFinalStep: false, error: "Incorrect OTP" });
    }
  });

// routes
app.use('/schools',schoolRouter);
app.use('/students',studentRouter);
app.use('/admin',adminRouter);
app.use('/class-teacher',teacherRoute);
app.use("/uploads", express.static("uploads"));
app.use("/",authRoute);



app.get("/loginS", isAlreadyLoggedIn,(req,res)=>{
    res.render("school/login");
});

app.get("/registerS",(req,res)=>{
    res.render("school/register", { showOtpStep: false, showFinalStep: false });
});




app.get("/",(req,res)=>{
    res.render("index.ejs");
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));