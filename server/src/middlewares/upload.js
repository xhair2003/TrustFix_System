const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require("../../config/cloudinary");

// Cấu hình lưu trữ trên Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'guides', // Thư mục lưu trữ trên Cloudinary
        resource_type: 'auto', // Hỗ trợ cả ảnh và video
    },
});

// Middleware upload
const upload = multer({ storage });

module.exports = upload;