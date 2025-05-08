const jwt = require('jsonwebtoken');
const School= require("./models/School");
require('dotenv').config();

//  Middleware: Verify Token (सभी users के लिए)
exports.verifyToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Access Denied! No Token Provided." });
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.school = verified; // Store school data in req object
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

//  Middleware: Admin Only Access
exports.adminOnly = (req, res, next) => {
    if (req.session.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};

module.exports = {
    //  Middleware to check if school is logged in
    isSchoolLoggedIn: (req, res, next) => {
        if (req.session && req.session.userId && req.session.role === "school") {
            return next();
        }
        req.flash("error_msg", "You must be logged in as a School!");
        return res.redirect("/loginS");
    },

    isTeacherLoggedIn : (req, res, next) => {
        if (req.session && req.session.userId && req.session.role === "classTeacher" ) {
          return next();
        }
        req.flash("error_msg", "You must be logged in as a class- teacher!");
        res.redirect("/loginS");
      },
      

    //  Middleware to check if admin is logged in
    isAdminLoggedIn: (req, res, next) => {
        if (req.session  && req.session.role === "admin") {
            return next();
        }
        req.flash("error_msg", "You must be logged in as a admin");
        return  res.redirect("/admin/login?key=" + process.env.SUPER_ADMIN_SECRET_KEY);
    },
    isAlreadyLoggedIn: (req, res, next) => {
    if (req.session && req.session.userId) {
        if (req.session.role === "school") {
            return res.redirect(`/schools/${req.session.userId}`);
        } else if (req.session.role === "classTeacher") {
            return res.redirect(`/class-teacher/${req.session.userId}`);
        }
    }
    next();
},
};


exports.authMiddleware = (role) => {
    return (req, res, next) => {
        const token = req.header("Authorization");
        if (!token) return res.status(401).json({ error: "No Token Provided!" });

        try {
            const verified = jwt.verify(token, SECRET_KEY);
            if (verified.role !== role) return res.status(403).json({ error: "Access Denied!" });

            req.user = verified; // `{ id, role }`
            next();
        } catch (err) {
            res.status(400).json({ error: "Invalid Token!" });
        }
    };
};




exports.errorHandler= (err, req, res, next) => {
    console.error(err.stack);
  
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong!';
  
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      statusCode = 400;
      const errors = Object.values(err.errors).map(e => e.message);
      message = errors.join(', ');
    }
  
    // Handle duplicate key errors (like unique email/username)
    if (err.code && err.code === 11000) {
      statusCode = 400;
      const field = Object.keys(err.keyValue)[0];
      message = `${field} already exists.`;
    }
  
    res.status(statusCode).json({
      success: false,
      error: message
    });
  };