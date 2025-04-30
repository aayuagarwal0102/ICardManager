

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");


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
    limits: { fileSize: 200 * 1024 }, // 200 KB limit
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

module.exports={
    cloudinary,upload
  };

