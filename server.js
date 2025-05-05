const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const ejsMate= require("ejs-mate");
const flash = require("connect-flash");
require('dotenv').config();
const nodemailer= require("nodemailer");

const app = express();
connectDB();  // Connect MongoDB

const path = require("path");
const session= require("express-session");
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

const schoolRouter= require("./routes/schoolRoutes.js");
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



// routes
app.use('/schools',schoolRouter);
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