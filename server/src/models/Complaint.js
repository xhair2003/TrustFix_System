const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request', // Tham chiếu đến model Request
        required: true,
    }, // ID của Request liên quan, từ đó lấy user_id
    complaintContent: {
        type: String,
        required: true
    }, // Nội dung khiếu nại
    complaintType: {
        type: String,
        enum: ['Dịch vụ kém', 'Phí không rõ ràng', 'Nhân viên không chuyên nghiệp', 'Khác'],
        required: true
    }, // Loại khiếu nại
    requestResolution: {
        type: String,
        enum: ['Hoàn tiền', 'Kiểm tra lại', 'Báo công an', 'Khác'],
        // required: true
    }, // Yêu cầu giải quyết khiếu nại
    image: {
        type: String, // Hoặc có thể dùng Array [String] nếu muốn cho phép nhiều ảnh
        required: false // Tùy chọn, có thể không bắt buộc phải có ảnh
    }, // Hình ảnh minh chứng (URL hoặc path)
    parentComplaint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        default: null
    }, // Nếu là phản hồi, tham chiếu đến khiếu nại cha
}, { timestamps: true });

// Ảo trường (Virtual field) để lấy danh sách phản hồi
ComplaintSchema.virtual('replies', {
    ref: 'Complaint',
    localField: '_id',
    foreignField: 'parentComplaint'
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
