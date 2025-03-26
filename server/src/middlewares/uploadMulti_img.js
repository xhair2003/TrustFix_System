const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../config/cloudinary");

// Cấu hình Multer để upload ảnh lên Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "multi_uploads", // Lưu ảnh vào thư mục multi_uploads trên Cloudinary
        allowed_formats: ["jpg", "png", "jpeg", "svg"],
        transformation: [{ width: 500, height: 500, crop: "limit" }]
    },
});

const upload = multer({ storage });

module.exports = upload;