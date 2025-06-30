const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require('path');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key :process.env.CLOUD_API_KEY,
    api_secret :process.env.CLOUD_API_SECRET
});

// Define Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "school_uploads", // Folder name in Cloudinary
        allowed_formats: ["jpg", "jpeg", "png", "gif"],
    },
});

// File size limit: 200 KB (200 * 1024 = 204800 bytes)
const upload = multer({
    storage,
    limits: { fileSize: 3*1024 * 1024 }, // 200 KB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(
            file.originalname.toLowerCase().split(".").pop()
        );
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error("Only images are allowed (jpeg, jpg, png, gif)!"));
    },
});

// Local storage for Excel files
const excelStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const uploadExcel = multer({
    storage: excelStorage,
    fileFilter: (req, file, cb) => {
        const filetypes = /xlsx|xls/;
        const extname = filetypes.test(file.originalname.toLowerCase().split('.').pop());
        const mimetype = file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype === 'application/vnd.ms-excel';
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only Excel files are allowed (.xlsx, .xls)!'));
    }
});

module.exports={
    cloudinary,upload,uploadExcel
  };

