const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const ejsMate= require("ejs-mate");
const flash = require("connect-flash");
require('dotenv').config();
const nodemailer= require("nodemailer");
const errorHandler = require('./middleware');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const expressValidator = require('express-validator');

const app = express();
connectDB();  // Connect MongoDB


// Prevent NoSQL injection
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());


// Cookie parser
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Body parser with size limits - increased for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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

// CORS configuration
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // In development, allow localhost
        if (process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }
        
        // In production, you can restrict to your domain
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5000',
            process.env.DOMAIN || 'http://localhost:5000' // Your domain in production
        ];
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600 // 10 minutes
}));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secure-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true, // Prevent client side access to cookies
        maxAge: 1000 * 60 * 120, // 120 minutes
        sameSite: 'strict' // Protect against CSRF
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

// 404 handler - must be after all routes
app.use((req, res, next) => {
    res.status(404).render('error', {
        status: '404',
        message: 'Oops! Page Not Found',
        description: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
    });
});

// Error handler - must be after 404 handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    const status = err.status || 500;
    const message =  'Something went wrong!';
    const description =  'An unexpected error occurred. Please try again later.';

    res.status(status).render('error', {
        status,
        message,
        description
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));